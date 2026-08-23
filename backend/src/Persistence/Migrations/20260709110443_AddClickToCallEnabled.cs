using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HasanHabibSeyda.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddClickToCallEnabled : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsClickToCallEnabled",
                table: "ConversionSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsClickToCallEnabled",
                table: "ConversionSettings");
        }
    }
}
