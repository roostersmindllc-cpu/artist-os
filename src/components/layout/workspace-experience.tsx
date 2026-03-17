"use client";

import type { Route } from "next";
import { BarChart3, CalendarPlus, Disc3, Plus, Users2 } from "lucide-react";
import type { ReactNode } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { useEffectEvent } from "react";
import { useRouter } from "next/navigation";

import {
  KeyboardShortcutsDialog
} from "@/components/layout/keyboard-shortcuts-dialog";
import {
  QuickAddDialog,
  type QuickAddView
} from "@/components/layout/quick-add-dialog";
import { Button } from "@/components/ui/button";
import type { ContentPlannerOptionsDto } from "@/services/content-types";

type WorkspaceExperienceContextValue = {
  activeQuickAdd: QuickAddView | null;
  openQuickAdd: (view?: QuickAddView) => void;
  setQuickAddView: (view: QuickAddView) => void;
  closeQuickAdd: () => void;
  openShortcuts: () => void;
  closeShortcuts: () => void;
};

type WorkspaceExperienceProviderProps = {
  children: ReactNode;
  contentOptions: ContentPlannerOptionsDto;
};

const WorkspaceExperienceContext = createContext<WorkspaceExperienceContextValue | null>(null);

const navigationShortcutMap: Record<string, Route> = {
  d: "/dashboard",
  r: "/releases",
  m: "/campaigns",
  c: "/content",
  f: "/fans",
  t: "/tasks",
  a: "/analytics",
  s: "/settings"
};

const quickAddShortcutMap: Record<string, QuickAddView> = {
  r: "release",
  p: "content",
  f: "fan",
  a: "analytics"
};

const mobileQuickAddItems = [
  {
    view: "release" as const,
    label: "Release",
    icon: Disc3
  },
  {
    view: "content" as const,
    label: "Post",
    icon: CalendarPlus
  },
  {
    view: "fan" as const,
    label: "Fan",
    icon: Users2
  },
  {
    view: "analytics" as const,
    label: "Analytics",
    icon: BarChart3
  }
];

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    Boolean(target.closest("[contenteditable='true']"))
  );
}

export function WorkspaceExperienceProvider({
  children,
  contentOptions
}: WorkspaceExperienceProviderProps) {
  const router = useRouter();
  const [activeQuickAdd, setActiveQuickAdd] = useState<QuickAddView | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [pendingSequence, setPendingSequence] = useState<"g" | "n" | null>(null);
  const clearTimerRef = useRef<number | null>(null);

  function clearPendingSequence() {
    if (clearTimerRef.current !== null) {
      window.clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }

    setPendingSequence(null);
  }

  function beginSequence(prefix: "g" | "n") {
    if (clearTimerRef.current !== null) {
      window.clearTimeout(clearTimerRef.current);
    }

    setPendingSequence(prefix);
    clearTimerRef.current = window.setTimeout(() => {
      setPendingSequence(null);
      clearTimerRef.current = null;
    }, 1600);
  }

  function closeAllOverlays() {
    setActiveQuickAdd(null);
    setIsShortcutsOpen(false);
    clearPendingSequence();
  }

  const handleKeydown = useEffectEvent((event: KeyboardEvent) => {
    const pressedKey = event.key.toLowerCase();

    if (event.key === "Escape") {
      closeAllOverlays();
      return;
    }

    if (isEditableTarget(event.target)) {
      return;
    }

    if ((event.shiftKey && event.key === "/") || event.key === "?") {
      event.preventDefault();
      setIsShortcutsOpen(true);
      setActiveQuickAdd(null);
      clearPendingSequence();
      return;
    }

    if (activeQuickAdd || isShortcutsOpen) {
      return;
    }

    if (!pendingSequence) {
      if (pressedKey === "g" || pressedKey === "n") {
        event.preventDefault();
        beginSequence(pressedKey);
      }

      return;
    }

    if (pendingSequence === "g") {
      const href = navigationShortcutMap[pressedKey];

      if (href) {
        event.preventDefault();
        clearPendingSequence();
        router.push(href);
      } else {
        clearPendingSequence();
      }

      return;
    }

    const quickAddView = quickAddShortcutMap[pressedKey];

    if (quickAddView) {
      event.preventDefault();
      clearPendingSequence();
      setActiveQuickAdd(quickAddView);
      return;
    }

    clearPendingSequence();
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      handleKeydown(event);
    };

    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);

      if (clearTimerRef.current !== null) {
        window.clearTimeout(clearTimerRef.current);
      }
    };
  }, []);

  const contextValue: WorkspaceExperienceContextValue = {
    activeQuickAdd,
    openQuickAdd: (view = "release") => {
      setIsShortcutsOpen(false);
      clearPendingSequence();
      setActiveQuickAdd(view);
    },
    setQuickAddView: (view) => {
      setActiveQuickAdd(view);
    },
    closeQuickAdd: () => {
      setActiveQuickAdd(null);
    },
    openShortcuts: () => {
      setActiveQuickAdd(null);
      clearPendingSequence();
      setIsShortcutsOpen(true);
    },
    closeShortcuts: () => {
      setIsShortcutsOpen(false);
    }
  };

  return (
    <WorkspaceExperienceContext.Provider value={contextValue}>
      {children}

      {pendingSequence ? (
        <div className="pointer-events-none fixed bottom-24 right-4 z-40 hidden rounded-2xl border border-border/70 bg-popover/92 px-4 py-3 shadow-xl backdrop-blur md:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/80">
            Shortcut
          </p>
          <p className="mt-1 text-sm text-foreground">
            {pendingSequence === "g"
              ? "Press a letter to navigate"
              : "Press a letter to quick add"}
          </p>
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-popover/92 px-3 py-3 shadow-2xl backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-[1360px] items-center gap-2">
          <Button
            variant="default"
            className="h-12 rounded-2xl px-4 shadow-sm"
            onClick={() => contextValue.openQuickAdd()}
          >
            <Plus className="size-4" />
            Quick add
          </Button>
          <div className="grid flex-1 grid-cols-4 gap-2">
            {mobileQuickAddItems.map((item) => {
              const Icon = item.icon;

              return (
                <Button
                  key={item.view}
                  variant="outline"
                  className="h-12 rounded-2xl border-border/70 bg-card/85 px-2"
                  onClick={() => contextValue.openQuickAdd(item.view)}
                >
                  <Icon className="size-4" />
                  <span className="sr-only">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <QuickAddDialog
        open={activeQuickAdd !== null}
        activeView={activeQuickAdd ?? "release"}
        contentOptions={contentOptions}
        onViewChange={(view) => setActiveQuickAdd(view)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveQuickAdd(null);
          }
        }}
      />
      <KeyboardShortcutsDialog
        open={isShortcutsOpen}
        onOpenChange={setIsShortcutsOpen}
      />
    </WorkspaceExperienceContext.Provider>
  );
}

export function useWorkspaceExperience() {
  const context = useContext(WorkspaceExperienceContext);

  if (!context) {
    throw new Error("useWorkspaceExperience must be used within WorkspaceExperienceProvider.");
  }

  return context;
}

export type { QuickAddView };
