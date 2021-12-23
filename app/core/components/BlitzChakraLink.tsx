import React from "react"
import { Link as ChakraLink } from "@chakra-ui/react"
import { Link as BlitzLink, LinkProps as BlitzLinkProps, RouteUrlObject } from "blitz"

type BlitzChakraLinkProps = BlitzLinkProps | React.ComponentProps<typeof ChakraLink>

export const BlitzChakraLink: React.FC<BlitzChakraLinkProps> = ({
  href,
  as,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  locale,
  children,
  ...props
}) => {
  return (
    <BlitzLink
      {...({ href, as, replace, scroll, shallow, prefetch, locale } as BlitzLinkProps)}
      passHref={typeof passHref === undefined ? true : passHref}
    >
      <ChakraLink color="blue.500" {...props}>
        {children}
      </ChakraLink>
    </BlitzLink>
  )
}
