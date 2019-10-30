﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ProgressiveWebAppBlog.Repository;

namespace ProgressiveWebAppBlog.Migrations
{
    [DbContext(typeof(Context))]
    [Migration("20191030030228_Adicionando tabelas de notificacao")]
    partial class Adicionandotabelasdenotificacao
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079");

            modelBuilder.Entity("BlogPost", b =>
                {
                    b.Property<int>("PostId")
                        .ValueGeneratedOnAdd();

                    b.Property<long>("CountComent");

                    b.Property<DateTime>("Date");

                    b.Property<string>("Image");

                    b.Property<string>("PrevDescription");

                    b.Property<string>("ShortDescription");

                    b.Property<string>("Title");

                    b.HasKey("PostId");

                    b.ToTable("BlogPost");
                });

            modelBuilder.Entity("ProgressiveWebAppBlog.Repository.Context+PushSubscription", b =>
                {
                    b.Property<string>("Endpoint")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Auth");

                    b.Property<string>("P256DH");

                    b.HasKey("Endpoint");

                    b.ToTable("Subscriptions");
                });
#pragma warning restore 612, 618
        }
    }
}