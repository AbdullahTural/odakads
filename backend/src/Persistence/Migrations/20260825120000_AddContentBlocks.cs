using System;
using HasanHabibSeyda.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HasanHabibSeyda.Persistence.Migrations
{
    /// <summary>
    /// Site icerigi (anahtar-deger) — additive migration. Yalnizca "ContentBlocks" tablosunu ekler.
    /// (El ile yazildi: gelistirme ortaminda .NET SDK yoktu.)
    /// </summary>
    [DbContext(typeof(AppDbContext))]
    [Migration("20260825120000_AddContentBlocks")]
    public partial class AddContentBlocks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContentBlocks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Key = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Value = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContentBlocks", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContentBlocks_Key",
                table: "ContentBlocks",
                column: "Key",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContentBlocks");
        }
    }
}
