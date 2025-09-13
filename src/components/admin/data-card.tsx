
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DataCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    description?: string;
}

export default function DataCard({ title, value, icon, description }: DataCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    )
}
