import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Building2, MapPin, Trash2, Edit } from "lucide-react";

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: "applied" | "interview" | "offer" | "rejected";
  location: string;
  appliedDate: string;
  notes?: string;
}

interface JobApplicationCardProps {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  applied: "bg-blue-100 text-blue-700 border border-blue-200",
  interview: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  offer: "bg-green-100 text-green-700 border border-green-200",
  rejected: "bg-red-100 text-red-700 border border-red-200",
};

export function JobApplicationCard({ application, onEdit, onDelete }: JobApplicationCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all border-2 border-pink-100 bg-gradient-to-br from-white to-pink-50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-pink-700">{application.position}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-pink-600">
              <Building2 className="w-4 h-4" />
              <span>{application.company}</span>
            </div>
          </div>
          <Badge className={statusColors[application.status]}>
            {application.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-pink-600">
            <MapPin className="w-4 h-4" />
            <span>{application.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-pink-600">
            <Calendar className="w-4 h-4" />
            <span>Applied: {application.appliedDate}</span>
          </div>
          {application.notes && (
            <p className="text-sm text-pink-700 mt-2 bg-pink-50 p-2 rounded-lg">{application.notes}</p>
          )}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(application)}
              className="flex-1 border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(application.id)}
              className="text-red-500 hover:text-red-700 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}