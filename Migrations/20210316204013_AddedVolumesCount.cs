using Microsoft.EntityFrameworkCore.Migrations;

namespace Niftified.Migrations
{
    public partial class AddedVolumesCount : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "VolumesCount",
                table: "Editions",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VolumesCount",
                table: "Editions");
        }
    }
}
