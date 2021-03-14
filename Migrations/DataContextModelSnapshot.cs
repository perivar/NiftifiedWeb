﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Niftified.Helpers;

namespace Niftified.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.8");

            modelBuilder.Entity("Niftified.Entities.Account", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool>("AcceptTerms")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Created")
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .HasColumnType("TEXT");

                    b.Property<string>("FirstName")
                        .HasColumnType("TEXT");

                    b.Property<string>("LanguageCode")
                        .HasColumnType("TEXT");

                    b.Property<string>("LastName")
                        .HasColumnType("TEXT");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("PasswordReset")
                        .HasColumnType("TEXT");

                    b.Property<string>("ResetToken")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("ResetTokenExpires")
                        .HasColumnType("TEXT");

                    b.Property<int>("Role")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("Updated")
                        .HasColumnType("TEXT");

                    b.Property<string>("VerificationToken")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("Verified")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Accounts");
                });

            modelBuilder.Entity("Niftified.Entities.Address", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("AddressId")
                        .HasColumnType("TEXT");

                    b.Property<decimal>("Balance")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<decimal>("Received")
                        .HasColumnType("TEXT");

                    b.Property<decimal>("Sent")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Addresses");
                });

            modelBuilder.Entity("Niftified.Entities.AddressTx", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("AddressId")
                        .HasColumnType("TEXT");

                    b.Property<decimal>("Amount")
                        .HasColumnType("TEXT");

                    b.Property<int>("BlockIndex")
                        .HasColumnType("INTEGER");

                    b.Property<string>("TxId")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("AddressTxs");
                });

            modelBuilder.Entity("Niftified.Entities.Collection", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("AccountId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<string>("LanguageCode")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<int>("Year")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.ToTable("Collections");
                });

            modelBuilder.Entity("Niftified.Entities.Edition", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("AccountId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("BoxName")
                        .HasColumnType("TEXT");

                    b.Property<int?>("CollectionId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Created")
                        .HasColumnType("TEXT");

                    b.Property<string>("DataSourceFileName")
                        .HasColumnType("TEXT");

                    b.Property<long>("DataSourceFileSize")
                        .HasColumnType("INTEGER");

                    b.Property<string>("DataSourceFileType")
                        .HasColumnType("TEXT");

                    b.Property<string>("DataSourcePath")
                        .HasColumnType("TEXT");

                    b.Property<byte[]>("DataSourceRawData")
                        .HasColumnType("BLOB");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("ExternalCreated")
                        .HasColumnType("TEXT");

                    b.Property<string>("ExternalDataSourceFileName")
                        .HasColumnType("TEXT");

                    b.Property<long>("ExternalDataSourceFileSize")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ExternalDataSourceFileType")
                        .HasColumnType("TEXT");

                    b.Property<string>("ExternalDataSourcePath")
                        .HasColumnType("TEXT");

                    b.Property<string>("ExternalHashId")
                        .HasColumnType("TEXT");

                    b.Property<string>("HashId")
                        .HasColumnType("TEXT");

                    b.Property<string>("LanguageCode")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("Notes")
                        .HasColumnType("TEXT");

                    b.Property<double>("SalesCommisionToBlockchain")
                        .HasColumnType("REAL");

                    b.Property<double>("SalesCommisionToCreators")
                        .HasColumnType("REAL");

                    b.Property<string>("Series")
                        .HasColumnType("TEXT");

                    b.Property<string>("Theme")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("Updated")
                        .HasColumnType("TEXT");

                    b.Property<string>("Version")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("CollectionId");

                    b.ToTable("Editions");
                });

            modelBuilder.Entity("Niftified.Entities.Likes", b =>
                {
                    b.Property<int>("AccountId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("LikedEditionIds")
                        .HasColumnType("TEXT");

                    b.Property<string>("LikedPersonIds")
                        .HasColumnType("TEXT");

                    b.Property<string>("LikedVolumeIds")
                        .HasColumnType("TEXT");

                    b.HasKey("AccountId");

                    b.ToTable("Likes");
                });

            modelBuilder.Entity("Niftified.Entities.Offer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<decimal>("Amount")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("Created")
                        .HasColumnType("TEXT");

                    b.Property<string>("CurrencyUniqueId")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("From")
                        .HasColumnType("TEXT");

                    b.Property<string>("LanguageCode")
                        .HasColumnType("TEXT");

                    b.Property<string>("PersonAlias")
                        .HasColumnType("TEXT");

                    b.Property<string>("PersonHashId")
                        .HasColumnType("TEXT");

                    b.Property<int>("PersonId")
                        .HasColumnType("INTEGER");

                    b.Property<decimal>("ServiceFeeAmount")
                        .HasColumnType("TEXT");

                    b.Property<int>("Status")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("To")
                        .HasColumnType("TEXT");

                    b.Property<int>("Type")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("PersonId");

                    b.ToTable("Offers");
                });

            modelBuilder.Entity("Niftified.Entities.Person", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("AccountId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Alias")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("Created")
                        .HasColumnType("TEXT");

                    b.Property<int?>("EditionId")
                        .HasColumnType("INTEGER");

                    b.Property<double>("SalesCommisionShare")
                        .HasColumnType("REAL");

                    b.Property<int>("Status")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Type")
                        .HasColumnType("INTEGER");

                    b.Property<string>("UniqueId")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("Updated")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("EditionId");

                    b.ToTable("Persons");
                });

            modelBuilder.Entity("Niftified.Entities.Tag", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<int?>("EditionId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("LanguageCode")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("EditionId");

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("Niftified.Entities.Tx", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("BlockHash")
                        .HasColumnType("TEXT");

                    b.Property<int>("BlockIndex")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Timestamp")
                        .HasColumnType("TEXT");

                    b.Property<decimal>("Total")
                        .HasColumnType("TEXT");

                    b.Property<string>("TxId")
                        .HasColumnType("TEXT");

                    b.Property<string>("Vin")
                        .HasColumnType("TEXT");

                    b.Property<string>("Vout")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Txs");
                });

            modelBuilder.Entity("Niftified.Entities.Volume", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<decimal>("Amount")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("Created")
                        .HasColumnType("TEXT");

                    b.Property<string>("CurrencyUniqueId")
                        .HasColumnType("TEXT");

                    b.Property<int>("EditionId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("EditionNumber")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ExternalHashId")
                        .HasColumnType("TEXT");

                    b.Property<string>("HashId")
                        .HasColumnType("TEXT");

                    b.Property<int?>("OwnerId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Status")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Type")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("Updated")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("EditionId");

                    b.HasIndex("OwnerId");

                    b.ToTable("Volumes");
                });

            modelBuilder.Entity("Niftified.Entities.Wallet", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Created")
                        .HasColumnType("TEXT");

                    b.Property<int?>("PersonId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("PrivateKeyEncrypted")
                        .HasColumnType("TEXT");

                    b.Property<string>("PublicKey")
                        .HasColumnType("TEXT");

                    b.Property<string>("ReceivingAddress")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("Updated")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("PersonId");

                    b.ToTable("Wallet");
                });

            modelBuilder.Entity("Niftified.Entities.Account", b =>
                {
                    b.OwnsMany("Niftified.Entities.RefreshToken", "RefreshTokens", b1 =>
                        {
                            b1.Property<int>("Id")
                                .ValueGeneratedOnAdd()
                                .HasColumnType("INTEGER");

                            b1.Property<int>("AccountId")
                                .HasColumnType("INTEGER");

                            b1.Property<DateTime>("Created")
                                .HasColumnType("TEXT");

                            b1.Property<string>("CreatedByIp")
                                .HasColumnType("TEXT");

                            b1.Property<DateTime>("Expires")
                                .HasColumnType("TEXT");

                            b1.Property<string>("ReplacedByToken")
                                .HasColumnType("TEXT");

                            b1.Property<DateTime?>("Revoked")
                                .HasColumnType("TEXT");

                            b1.Property<string>("RevokedByIp")
                                .HasColumnType("TEXT");

                            b1.Property<string>("Token")
                                .HasColumnType("TEXT");

                            b1.HasKey("Id");

                            b1.HasIndex("AccountId");

                            b1.ToTable("RefreshToken");

                            b1.WithOwner("Account")
                                .HasForeignKey("AccountId");
                        });
                });

            modelBuilder.Entity("Niftified.Entities.Edition", b =>
                {
                    b.HasOne("Niftified.Entities.Collection", "Collection")
                        .WithMany()
                        .HasForeignKey("CollectionId");
                });

            modelBuilder.Entity("Niftified.Entities.Offer", b =>
                {
                    b.HasOne("Niftified.Entities.Person", "Person")
                        .WithMany()
                        .HasForeignKey("PersonId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Niftified.Entities.Person", b =>
                {
                    b.HasOne("Niftified.Entities.Edition", null)
                        .WithMany("Creators")
                        .HasForeignKey("EditionId");
                });

            modelBuilder.Entity("Niftified.Entities.Tag", b =>
                {
                    b.HasOne("Niftified.Entities.Edition", null)
                        .WithMany("Tags")
                        .HasForeignKey("EditionId");
                });

            modelBuilder.Entity("Niftified.Entities.Volume", b =>
                {
                    b.HasOne("Niftified.Entities.Edition", null)
                        .WithMany("Volumes")
                        .HasForeignKey("EditionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Niftified.Entities.Person", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId");
                });

            modelBuilder.Entity("Niftified.Entities.Wallet", b =>
                {
                    b.HasOne("Niftified.Entities.Person", null)
                        .WithMany("Wallets")
                        .HasForeignKey("PersonId");
                });
#pragma warning restore 612, 618
        }
    }
}
