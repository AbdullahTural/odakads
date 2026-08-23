using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HasanHabibSeyda.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Phase3Settings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AboutSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FounderName = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    FounderTitle = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    FounderDescription = table.Column<string>(type: "nvarchar(1500)", maxLength: 1500, nullable: false),
                    CompanyStory = table.Column<string>(type: "nvarchar(3000)", maxLength: 3000, nullable: false),
                    MissionText = table.Column<string>(type: "nvarchar(1500)", maxLength: 1500, nullable: false),
                    VisionText = table.Column<string>(type: "nvarchar(1500)", maxLength: 1500, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AboutSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ActivityLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserEmail = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Action = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    EntityName = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: true),
                    EntityId = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IpAddress = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    UserAgent = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AnalyticsSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GoogleAnalyticsMeasurementId = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    GoogleTagManagerId = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    GoogleSearchConsoleVerificationCode = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    MicrosoftClarityProjectId = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    MetaPixelId = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    LinkedinInsightTagPartnerId = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnalyticsSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserEmail = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    EntityName = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    EntityId = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    Action = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    OldValuesJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NewValuesJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ChangedFieldsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IpAddress = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    UserAgent = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ConversionSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    WhatsappPhoneNumber = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    WhatsappDefaultMessage = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsWhatsappEnabled = table.Column<bool>(type: "bit", nullable: false),
                    CalendlyUrl = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    IsCalendlyEnabled = table.Column<bool>(type: "bit", nullable: false),
                    PrimaryCtaText = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    PrimaryCtaUrl = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    SecondaryCtaText = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    SecondaryCtaUrl = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConversionSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SeoSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PageKey = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    PageName = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: false),
                    Keywords = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: false),
                    CanonicalUrl = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeoSettings", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ActivityLogs_CreatedDate",
                table: "ActivityLogs",
                column: "CreatedDate");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_CreatedDate",
                table: "AuditLogs",
                column: "CreatedDate");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_EntityName",
                table: "AuditLogs",
                column: "EntityName");

            migrationBuilder.CreateIndex(
                name: "IX_SeoSettings_PageKey",
                table: "SeoSettings",
                column: "PageKey",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AboutSettings");

            migrationBuilder.DropTable(
                name: "ActivityLogs");

            migrationBuilder.DropTable(
                name: "AnalyticsSettings");

            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "ConversionSettings");

            migrationBuilder.DropTable(
                name: "SeoSettings");
        }
    }
}
