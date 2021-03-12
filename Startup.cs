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

namespace WebApi
{
	public class Startup
	{
		public IConfiguration Configuration { get; }

		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		// add services to the DI container
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddDbContext<DataContext>();
			services.AddCors();
			services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.IgnoreNullValues = true);
			services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

			services.AddSwaggerGen(c =>
				{
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
			services.AddScoped<IAccountService, AccountService>();
			services.AddScoped<IEmailService, EmailService>();
			services.AddScoped<INiftyService, NiftyService>();
		}

		// configure the HTTP request pipeline
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DataContext context)
		{
			// migrate database changes on startup (includes initial db creation)
			context.Database.Migrate();

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
