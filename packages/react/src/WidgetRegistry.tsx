import { createContext, useContext } from "react";
import type { ComponentType, ReactNode } from "react";

export type WidgetMap = Record<string, ComponentType<{ data: Record<string, unknown> }>>;

const WidgetRegistryContext = createContext<WidgetMap>({});

export function WidgetRegistryProvider({
  widgets,
  children
}: {
  widgets?: WidgetMap;
  children: ReactNode;
}) {
  return (
    <WidgetRegistryContext.Provider value={widgets ?? {}}>
      {children}
    </WidgetRegistryContext.Provider>
  );
}

export function useWidgetRegistry() {
  return useContext(WidgetRegistryContext);
}
