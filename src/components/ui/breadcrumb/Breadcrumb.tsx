import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { breadcrumbRoutes } from '@/routers/routes';

export default function Breadcrumbs() {
  const pathname = window.location.pathname;

  const matchedRoutes = breadcrumbRoutes.filter((r) => pathname.startsWith(r.path));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/">{breadcrumbRoutes[0].breadcrumb}</BreadcrumbLink>
        </BreadcrumbItem>

        {matchedRoutes.map((segment, index) => {
          if (index === 0) return null;

          const isLast = index === matchedRoutes.length - 1;

          return (
            <span key={segment.path} className="flex items-center">
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{segment.breadcrumb}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={segment.path}>{segment.breadcrumb}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
