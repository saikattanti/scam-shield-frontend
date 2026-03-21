"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as React from "react";

type BaseProps = {
  text?: string;
  primaryColor?: string;
  className?: string;
};

type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type LinkProps = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type SlideArrowButtonProps = ButtonProps | LinkProps;

export default function SlideArrowButton(props: SlideArrowButtonProps) {
  const {
    text = "Get Started",
    primaryColor = "#6f3cff",
    className,
    ...rest
  } = props;

  const sharedClassName = [
    "group relative inline-flex min-h-11 max-w-full items-center rounded-full border border-white bg-white p-2 text-base font-semibold shadow-sm transition-transform duration-200 ease-in-out hover:-translate-y-0.5",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <div
        className="absolute left-0 top-0 flex h-full w-11 items-center justify-end rounded-full transition-all duration-200 ease-in-out group-hover:w-full"
        style={{ backgroundColor: primaryColor }}
      >
        <span className="mr-3 text-white transition-all duration-200 ease-in-out">
          <ArrowRight size={20} />
        </span>
      </div>
      <span className="relative left-4 z-10 whitespace-nowrap px-6 font-semibold text-black transition-all duration-200 ease-in-out group-hover:-left-3 group-hover:text-white sm:px-7">
        {text}
      </span>
    </>
  );

  if ("href" in props && props.href) {
    const { href, ...anchorProps } = rest as Omit<LinkProps, keyof BaseProps>;
    return (
      <Link href={href} className={sharedClassName} {...anchorProps}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={sharedClassName}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
