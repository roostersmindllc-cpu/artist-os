import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  taskPriorityLabels,
  taskRelatedTypeLabels,
  taskStatusLabels
} from "@/lib/domain-config";
import { getStatusVariant } from "@/lib/presentation";
import { formatDate, formatRelativeTime } from "@/lib/utils";

type TaskListItem = {
  id: string;
  title: string;
  relatedType: keyof typeof taskRelatedTypeLabels | null;
  dueDate: Date | null;
  priority: keyof typeof taskPriorityLabels;
  status: keyof typeof taskStatusLabels;
  updatedAt: Date;
};

type TaskListProps = {
  tasks: TaskListItem[];
};

export function TaskList({ tasks }: TaskListProps) {
  return (
    <>
      <div className="space-y-3 p-4 md:hidden">
        {tasks.map((task) => (
          <article
            key={task.id}
            className="border-border/70 bg-background/45 rounded-2xl border p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-foreground font-medium">{task.title}</p>
                <p className="text-muted-foreground text-sm">
                  {task.relatedType
                    ? taskRelatedTypeLabels[task.relatedType]
                    : "Unlinked"}
                </p>
              </div>
              <Badge variant={getStatusVariant(task.status)}>
                {taskStatusLabels[task.status]}
              </Badge>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant={getStatusVariant(task.priority)}>
                {taskPriorityLabels[task.priority]}
              </Badge>
              <Badge variant="outline">
                Due {task.dueDate ? formatDate(task.dueDate) : "Any time"}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-3 text-xs">
              Updated {formatRelativeTime(task.updatedAt)}
            </p>
          </article>
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Related</TableHead>
              <TableHead>Due date</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(task.status)}>
                    {taskStatusLabels[task.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(task.priority)}>
                    {taskPriorityLabels[task.priority]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {task.relatedType
                    ? taskRelatedTypeLabels[task.relatedType]
                    : "Unlinked"}
                </TableCell>
                <TableCell>{formatDate(task.dueDate)}</TableCell>
                <TableCell>{formatRelativeTime(task.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
