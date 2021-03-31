using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using Niftified.Helpers;
using Niftified.Middleware;
using Niftified.Services;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore;
using Stripe;
using System.Linq;

namespace WebApi
{
	public class Startup
	{
		public IConfiguration Configuration { get; }

		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;

			// load .env file
			DotNetEnv.Env.Load();

			// set config using env var
			StripeConfiguration.ApiKey = System.Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");
		}

		// add services to the DI container
		public void ConfigureServices(IServiceCollection services)
		{
			services.Configure<StripeOptions>(options =>
			{
				options.PublishableKey = Environment.GetEnvironmentVariable("STRIPE_PUBLISHABLE_KEY");
				options.SecretKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");
				options.WebhookSecret = Environment.GetEnvironmentVariable("STRIPE_WEBHOOK_SECRET");
				options.PaymentMethodTypes = Environment.GetEnvironmentVariable("STRIPE_PAYMENT_TYPES").Split(",").ToList();
				options.Domain = Environment.GetEnvironmentVariable("STRIPE_DOMAIN");
			});

			services.AddDbContext<DataContext>();
			services.AddCors();

			services.AddControllers().AddNewtonsoftJson(options =>
			{
				options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
				options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
			}
			);

			// in order to access the User when using a custom data model for users
			services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

			services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

			services.AddSwaggerGen(c =>
				{
					// add support for account model (otherwise it crashes with stripe account model)
					c.CustomSchemaIds(type => type.ToString());

					c.SwaggerDoc("v1", new OpenApiInfo { Title = "Niftified-Service", Version = "v1" });

					c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
					{
						Name = "Authorization",
						Type = SecuritySchemeType.ApiKey,
						Scheme = "Bearer",
						BearerFormat = "JWT",
						In = ParameterLocation.Header,
						Description = "JWT Authorization header using the Bearer scheme."
					});

					c.AddSecurityRequirement(new OpenApiSecurityRequirement
					{
			 {
				   new OpenApiSecurityScheme
					 {
						 Reference = new OpenApiReference
						 {
							 Type = ReferenceType.SecurityScheme,
							 Id = "Bearer"
						 }
					 },
					 new string[] {}

			 }
					});
				});

			// configure strongly typed settings object
			services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));

			// configure DI for application services
			services.AddScoped<INiftyAccountService, NiftyAccountService>();
			services.AddScoped<IEmailService, EmailService>();
			services.AddScoped<INiftyService, NiftyService>();
		}

		// configure the HTTP request pipeline
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DataContext context)
		{
			// migrate database changes on startup (includes initial db creation)
			// You would either call EnsureCreated() or Migrate(). 
			// EnsureCreated() is an alternative that completely skips the migrations pipeline and just creates a database that matches you current model. 
			// It's good for unit testing or very early prototyping, when you are happy just to delete and re-create the database when the model changes.
			// db.Database.EnsureDeleted();
			// db.Database.EnsureCreated();

			// Note! Therefore don't use EnsureDeleted() and EnsureCreated() but Migrate();
			context.Database.Migrate();

			if (env.IsDevelopment())
			{
				app.UseRequestResponseLogging();
				app.UseDeveloperExceptionPage();
				app.UseDatabaseErrorPage();
			}

			// generated swagger json and swagger ui middleware
			app.UseSwagger();
			app.UseSwaggerUI(x => x.SwaggerEndpoint("/swagger/v1/swagger.json", "Niftified API"));

			app.UseRouting();

			// global cors policy
			app.UseCors(x => x
				.SetIsOriginAllowed(origin => true)
				.AllowAnyMethod()
				.AllowAnyHeader()
				.AllowCredentials());

			// global error handler
			app.UseMiddleware<ErrorHandlerMiddleware>();

			// custom jwt auth middleware
			app.UseMiddleware<JwtMiddleware>();

			app.UseEndpoints(x => x.MapControllers());
		}
	}
}
