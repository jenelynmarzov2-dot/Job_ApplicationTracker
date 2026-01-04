import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { JobApplication } from "./job-application-card";

interface ApplicationCalendarProps {
  applications: JobApplication[];
}

export function ApplicationCalendar({ applications }: ApplicationCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get applications for the selected date
  const getApplicationsForDate = (date: Date | undefined) => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return applications.filter((app) => app.appliedDate === dateStr);
  };

  // Get all dates with applications
  const getDatesWithApplications = () => {
    return applications.map((app) => new Date(app.appliedDate));
  };

  const selectedDateApplications = getApplicationsForDate(selectedDate);
  const datesWithApplications = getDatesWithApplications();

  return (
    <Card className="shadow-lg border-2 border-pink-100">
      <CardHeader>
        <CardTitle className="text-pink-600 text-center">Application Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="w-full flex justify-center items-center">
            <div className="scale-125 my-8">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-lg border-2 border-pink-200 shadow-md"
                modifiers={{
                  hasApplication: datesWithApplications,
                }}
                modifiersClassNames={{
                  hasApplication: "bg-pink-200 font-semibold text-pink-800",
                }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="space-y-3">
              <h3 className="font-semibold text-pink-600">
                Applications on {selectedDate?.toLocaleDateString() || "Select a date"}
              </h3>
              {selectedDateApplications.length > 0 ? (
                <div className="space-y-2">
                  {selectedDateApplications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 border-2 border-pink-100 rounded-lg hover:bg-pink-50 transition-colors shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-pink-800">{app.position}</p>
                          <p className="text-sm text-pink-600">{app.company}</p>
                        </div>
                        <Badge className="bg-pink-200 text-pink-800 border-pink-300">
                          {app.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-pink-400 text-sm">
                  No applications on this date
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}