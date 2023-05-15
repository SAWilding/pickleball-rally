"use client";
import "@/app/globals.css";
import React from "react";
import Image from "next/image";
import Button from "./button";
import Link from "next/link";

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <header>
        <this.Logo></this.Logo>
        <this.Navigation></this.Navigation>
        <Button href="/find" content="Login"></Button>
      </header>
    );
  }
  Navigation() {
    return (
      <nav className="grow">
        <ul>
          <li>
            <Link href="/find">Find</Link>
          </li>
          <li>
            <Link href="/create">Create</Link>
          </li>
          <li>
            <Link href="joined">Joined</Link>
          </li>
        </ul>
      </nav>
    );
  }
  Logo() {
    return (
      <Link href="/">
        <Image src="/next.svg" alt="Logo image" width={100} height={75} />
      </Link>
    );
  }
}
