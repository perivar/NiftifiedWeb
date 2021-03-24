using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Niftified.Migrations
{
    public partial class InitialDatabase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LanguageCode = table.Column<string>(nullable: true),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    PasswordHash = table.Column<string>(nullable: true),
                    AcceptTerms = table.Column<bool>(nullable: false),
                    Role = table.Column<int>(nullable: false),
                    VerificationToken = table.Column<string>(nullable: true),
                    Verified = table.Column<DateTime>(nullable: true),
                    ResetToken = table.Column<string>(nullable: true),
                    ResetTokenExpires = table.Column<DateTime>(nullable: true),
                    PasswordReset = table.Column<DateTime>(nullable: true),
                    Created = table.Column<DateTime>(nullable: false),
                    Updated = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Addresses",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AddressId = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Received = table.Column<decimal>(nullable: false),
                    Sent = table.Column<decimal>(nullable: false),
                    Balance = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addresses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AddressTxs",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AddressId = table.Column<string>(nullable: true),
                    BlockIndex = table.Column<int>(nullable: false),
                    TxId = table.Column<string>(nullable: true),
                    Amount = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AddressTxs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Collections",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AccountId = table.Column<int>(nullable: false),
                    LanguageCode = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Year = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Collections", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Likes",
                columns: table => new
                {
                    AccountId = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LikedEditionIds = table.Column<string>(nullable: true),
                    LikedVolumeIds = table.Column<string>(nullable: true),
                    LikedPersonIds = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Likes", x => x.AccountId);
                });

            migrationBuilder.CreateTable(
                name: "Txs",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TxId = table.Column<string>(nullable: true),
                    Vin = table.Column<string>(nullable: true),
                    Vout = table.Column<string>(nullable: true),
                    Total = table.Column<decimal>(nullable: false),
                    Timestamp = table.Column<DateTime>(nullable: false),
                    BlockHash = table.Column<string>(nullable: true),
                    BlockIndex = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Txs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Persons",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Created = table.Column<DateTime>(nullable: false),
                    Updated = table.Column<DateTime>(nullable: true),
                    AccountId = table.Column<int>(nullable: false),
                    Alias = table.Column<string>(nullable: true),
                    IsAnonymous = table.Column<bool>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    IsConfirmed = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Persons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Persons_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RefreshToken",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AccountId = table.Column<int>(nullable: false),
                    Token = table.Column<string>(nullable: true),
                    Expires = table.Column<DateTime>(nullable: false),
                    Created = table.Column<DateTime>(nullable: false),
                    CreatedByIp = table.Column<string>(nullable: true),
                    Revoked = table.Column<DateTime>(nullable: true),
                    RevokedByIp = table.Column<string>(nullable: true),
                    ReplacedByToken = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshToken", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshToken_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Editions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AccountId = table.Column<int>(nullable: false),
                    LanguageCode = table.Column<string>(nullable: true),
                    HashId = table.Column<string>(nullable: true),
                    ExternalHashId = table.Column<string>(nullable: true),
                    SalesCommissionToBlockchain = table.Column<decimal>(nullable: false),
                    SalesCommissionToCreators = table.Column<decimal>(nullable: false),
                    Created = table.Column<DateTime>(nullable: false),
                    ExternalCreate = table.Column<DateTime>(nullable: true),
                    Updated = table.Column<DateTime>(nullable: true),
                    VolumesCount = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Version = table.Column<string>(nullable: true),
                    Notes = table.Column<string>(nullable: true),
                    Series = table.Column<string>(nullable: true),
                    BoxName = table.Column<string>(nullable: true),
                    Theme = table.Column<string>(nullable: true),
                    CollectionId = table.Column<int>(nullable: true),
                    DataSourcePath = table.Column<string>(nullable: true),
                    DataSourceFileType = table.Column<string>(nullable: true),
                    DataSourceFileName = table.Column<string>(nullable: true),
                    DataSourceFileSize = table.Column<long>(nullable: false),
                    DataSourceRawData = table.Column<byte[]>(nullable: true),
                    ExternalDataSourcePath = table.Column<string>(nullable: true),
                    ExternalDataSourceFileType = table.Column<string>(nullable: true),
                    ExternalDataSourceFileName = table.Column<string>(nullable: true),
                    ExternalDataSourceFileSize = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Editions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Editions_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Editions_Collections_CollectionId",
                        column: x => x.CollectionId,
                        principalTable: "Collections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Offers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LanguageCode = table.Column<string>(nullable: true),
                    Type = table.Column<int>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    PersonId = table.Column<int>(nullable: false),
                    PersonAlias = table.Column<string>(nullable: true),
                    PersonHashId = table.Column<string>(nullable: true),
                    Created = table.Column<DateTime>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    Amount = table.Column<decimal>(nullable: false),
                    CurrencyUniqueId = table.Column<string>(nullable: true),
                    From = table.Column<DateTime>(nullable: false),
                    To = table.Column<DateTime>(nullable: false),
                    ServiceFeeAmount = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Offers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Offers_Persons_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Persons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Wallets",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Created = table.Column<DateTime>(nullable: false),
                    Updated = table.Column<DateTime>(nullable: true),
                    PersonId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Type = table.Column<int>(nullable: false),
                    PrivateKeyEncrypted = table.Column<string>(nullable: true),
                    PrivateKeyWIFEncrypted = table.Column<string>(nullable: true),
                    PublicAddress = table.Column<string>(nullable: true),
                    PublicKey = table.Column<string>(nullable: true),
                    PublicKeyHash = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Wallets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Wallets_Persons_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Persons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Creator",
                columns: table => new
                {
                    EditionId = table.Column<int>(nullable: false),
                    PersonId = table.Column<int>(nullable: false),
                    Type = table.Column<int>(nullable: false),
                    SalesCommissionShare = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Creator", x => new { x.EditionId, x.PersonId });
                    table.ForeignKey(
                        name: "FK_Creator_Editions_EditionId",
                        column: x => x.EditionId,
                        principalTable: "Editions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Creator_Persons_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Persons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LanguageCode = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    EditionId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tags_Editions_EditionId",
                        column: x => x.EditionId,
                        principalTable: "Editions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Volumes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Created = table.Column<DateTime>(nullable: false),
                    Updated = table.Column<DateTime>(nullable: true),
                    HashId = table.Column<string>(nullable: true),
                    ExternalHashId = table.Column<string>(nullable: true),
                    OwnerId = table.Column<int>(nullable: true),
                    Status = table.Column<int>(nullable: false),
                    Type = table.Column<int>(nullable: false),
                    Amount = table.Column<decimal>(nullable: false),
                    CurrencyUniqueId = table.Column<string>(nullable: true),
                    EditionId = table.Column<int>(nullable: false),
                    EditionNumber = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Volumes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Volumes_Editions_EditionId",
                        column: x => x.EditionId,
                        principalTable: "Editions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Volumes_Persons_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Persons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Creator_PersonId",
                table: "Creator",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_Editions_AccountId",
                table: "Editions",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Editions_CollectionId",
                table: "Editions",
                column: "CollectionId");

            migrationBuilder.CreateIndex(
                name: "IX_Offers_PersonId",
                table: "Offers",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_Persons_AccountId",
                table: "Persons",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshToken_AccountId",
                table: "RefreshToken",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Tags_EditionId",
                table: "Tags",
                column: "EditionId");

            migrationBuilder.CreateIndex(
                name: "IX_Volumes_EditionId",
                table: "Volumes",
                column: "EditionId");

            migrationBuilder.CreateIndex(
                name: "IX_Volumes_OwnerId",
                table: "Volumes",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_Wallets_PersonId",
                table: "Wallets",
                column: "PersonId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Addresses");

            migrationBuilder.DropTable(
                name: "AddressTxs");

            migrationBuilder.DropTable(
                name: "Creator");

            migrationBuilder.DropTable(
                name: "Likes");

            migrationBuilder.DropTable(
                name: "Offers");

            migrationBuilder.DropTable(
                name: "RefreshToken");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "Txs");

            migrationBuilder.DropTable(
                name: "Volumes");

            migrationBuilder.DropTable(
                name: "Wallets");

            migrationBuilder.DropTable(
                name: "Editions");

            migrationBuilder.DropTable(
                name: "Persons");

            migrationBuilder.DropTable(
                name: "Collections");

            migrationBuilder.DropTable(
                name: "Accounts");
        }
    }
}
