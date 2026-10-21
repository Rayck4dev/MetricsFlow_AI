import { useRouter } from "next/navigation";
import { Settings, Sparkles } from "lucide-react";
import { navigation, accountNavigation, type SidebarSection } from "@/data/sidebar.data";
import { SidebarHeader } from "@/components/sidebar/SidebarHeader";
import { SidebarNavigationItem } from "@/components/sidebar/SidebarNavigationItem";
import { SidebarStatus } from "@/components/sidebar/SidebarStatus";
import { SidebarUser } from "@/components/sidebar/SidebarUser";

interface SidebarContentProps {
  demo: boolean;
  displayCompanyName: string;
  displayUserName: string;
  userLoading: boolean;
  role: "owner" | "collaborator" | null;
  visibleNavigation: typeof navigation;
  visibleAccountNavigation: typeof accountNavigation;
  activeDemoSection: SidebarSection;
  hoveredTab: SidebarSection | null;
  layoutNamespace: string;
  isActive: (href: string) => boolean;
  onHover: (id: SidebarSection | null) => void;
  onNavigate: () => void;
  onDemoNavigation: (section: SidebarSection) => void;
  onLogout?: () => void;
}

export function SidebarContent({
  demo,
  displayCompanyName,
  displayUserName,
  userLoading,
  role,
  visibleNavigation,
  visibleAccountNavigation,
  activeDemoSection,
  hoveredTab,
  layoutNamespace,
  isActive,
  onHover,
  onNavigate,
  onDemoNavigation,
  onLogout,
}: SidebarContentProps) {
  const router = useRouter();

  return (
    <>
      <SidebarHeader
        demo={demo}
        companyName={displayCompanyName}
        userLoading={userLoading}
      />

      <div className="flex min-h-0 flex-1 flex-col">
        <nav
          className="
            relative
            flex-1
            space-y-1
            overflow-y-auto
            p-3
          "
          onMouseLeave={() => onHover(null)}
        >
          <div className="flex items-center justify-between px-3 pb-2.5 pt-2">
            <p
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-slate-600
              "
            >
              {demo ? "Demonstração" : "Navegação"}
            </p>

            {demo && <Sparkles size={10} className="text-brand-400/60" />}
          </div>

          <div className="space-y-1">
            {userLoading && !demo ? (
              <NavigationSkeleton />
            ) : (
              visibleNavigation.map((item) => (
                <SidebarNavigationItem
                  key={item.id}
                  item={item}
                  demo={demo}
                  active={
                    demo ? activeDemoSection === item.id : isActive(item.href)
                  }
                  hovered={hoveredTab === item.id}
                  layoutNamespace={layoutNamespace}
                  onHover={onHover}
                  onNavigate={onNavigate}
                  onDemoNavigation={onDemoNavigation}
                />
              ))
            )}
          </div>

          <div className="mt-5 border-t border-surface-border pt-4">
            <div className="flex items-center justify-between px-3 pb-2">
              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-slate-600
                "
              >
                Conta
              </p>

              <Settings size={11} className="text-slate-700" />
            </div>

            <div className="space-y-1">
              {userLoading && !demo ? (
                <NavigationSkeleton />
              ) : (
                visibleAccountNavigation.map((item) => (
                  <SidebarNavigationItem
                    key={item.id}
                    item={item}
                    demo={demo}
                    variant="account"
                    active={
                      demo ? activeDemoSection === item.id : isActive(item.href)
                    }
                    hovered={hoveredTab === item.id}
                    layoutNamespace={layoutNamespace}
                    onHover={onHover}
                    onNavigate={onNavigate}
                    onDemoNavigation={onDemoNavigation}
                  />
                ))
              )}
            </div>
          </div>
        </nav>

        <SidebarStatus demo={demo} />

        <SidebarUser
          demo={demo}
          userName={userLoading && !demo ? "Carregando..." : displayUserName}
          userRole={role}
          onLogout={() => {
            onLogout?.();
            router.replace("/login");
            router.refresh();
          }}
        />
      </div>
    </>
  );
}

function NavigationSkeleton() {
  return (
    <div className="space-y-2 px-2 py-1">
      <div className="h-9 animate-pulse rounded-xl bg-surface-panel/50" />
      <div className="h-9 animate-pulse rounded-xl bg-surface-panel/40" />
      <div className="h-9 animate-pulse rounded-xl bg-surface-panel/40" />
    </div>
  );
}
