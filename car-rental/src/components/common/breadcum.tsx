import Link from "next/link";

// 1. Kiểu cho từng breadcrumb item
interface BreadcrumbItem {
    label: string;
    path?: string; // path là tùy chọn, nếu không có thì không tạo link
}

// 2. Props của component
interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <div className="mb-4 text-sm text-gray-600">
            {items.map((item, index) => (
                <span key={index} className="inline-flex items-center">
          {item.path ? (
              <Link href={item.path}>
              <span className="text-blue-600 cursor-pointer hover:underline">
                {item.label}
              </span>
              </Link>
          ) : (
              <span>{item.label}</span>
          )}
                    {index < items.length - 1 && <span className="mx-1">{">"}</span>}
        </span>
            ))}
        </div>
    );
};

export default Breadcrumb;
