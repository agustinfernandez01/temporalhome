'use client';

import { createContext, useContext } from "react";

export type Rol = "admin" | "user";

const RoleContext = createContext<Rol>("user");

export const useRole = () => useContext(RoleContext);

export function RoleProvider({
  value,
  children,
}: {
  value: Rol;
  children: React.ReactNode;
}) {
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}
