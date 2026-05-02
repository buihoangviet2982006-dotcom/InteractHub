using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class RefactorStoryToMediaData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MediaUrl",
                table: "Stories");

            migrationBuilder.AddColumn<string>(
                name: "Content",
                table: "Stories",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "MediaData",
                table: "Stories",
                type: "varbinary(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Content",
                table: "Stories");

            migrationBuilder.DropColumn(
                name: "MediaData",
                table: "Stories");

            migrationBuilder.AddColumn<string>(
                name: "MediaUrl",
                table: "Stories",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");
        }
    }
}
