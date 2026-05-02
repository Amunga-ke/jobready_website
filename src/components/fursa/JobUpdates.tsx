import SectionNumber from "./SectionNumber";
import { Bell, Mail, CalendarCheck } from "lucide-react";

const PLACEHOLDER_ITEMS = [
  {
    icon: Bell,
    label: "No updates yet",
    description: "Stay tuned for updates on your applications — shortlisting notifications, interview invites, and reapplication deadlines will appear here.",
  },
  {
    icon: Mail,
    label: "No new messages",
    description: "When employers respond to your application, their messages will show up here.",
  },
  {
    icon: CalendarCheck,
    label: "No upcoming deadlines",
    description: "Application deadlines for jobs you've saved or applied to will be tracked here.",
  },
];

export default function JobUpdates() {
  return (
    <section className="py-14 border-t border-divider relative overflow-hidden">
      <SectionNumber num="01" />
      <div className="max-w-6xl mx-auto px-5 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold">Your Updates</h2>
          <span className="text-[10px] font-mono text-muted/50 uppercase tracking-widest">Activity feed</span>
        </div>

        <div className="space-y-0 divide-y divide-divider">
          {PLACEHOLDER_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-start gap-4 py-5"
              >
                <div className="w-10 h-10 border border-divider rounded-lg flex items-center justify-center shrink-0 bg-ink/[0.02]">
                  <Icon className="w-4.5 h-4.5 text-muted/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-ink/50">{item.label}</p>
                  <p className="text-[12px] text-muted/50 mt-0.5 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
