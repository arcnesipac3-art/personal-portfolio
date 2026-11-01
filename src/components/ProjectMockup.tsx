import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Calendar,
  TrendingUp,
  FileText,
  Bell,
  type LucideIcon,
} from "lucide-react";

type MockupVariant = "dashboard" | "requirements" | "attendance" | "notifications";

interface ProjectMockupProps {
  variant: MockupVariant;
}

const navItems: { icon: LucideIcon; label: string }[] = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: FileText, label: "Requirements" },
  { icon: Calendar, label: "Attendance" },
  { icon: Users, label: "Students" },
  { icon: Bell, label: "Notifications" },
];

function Sidebar({ activeLabel }: { activeLabel: string }) {
  return (
    <div className="hidden w-12 shrink-0 flex-col items-center gap-0.5 border-r border-white/[0.04] bg-[#070a12] py-3 sm:flex">
      <div className="mb-2 flex h-7 w-7 items-center justify-center bg-blue-500/15">
        <span className="font-mono text-[9px] font-bold text-blue-400">T</span>
      </div>
      <div className="mb-0.5 h-px w-6 bg-white/[0.04]" />
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.label === activeLabel;
        return (
          <div
            key={item.label}
            className={`flex h-7 w-7 items-center justify-center transition-colors ${
              isActive
                ? "bg-blue-500/15 text-blue-400"
                : "text-slate-600 hover:text-slate-400"
            }`}
          >
            <Icon size={13} />
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: "complete" | "pending" | "incomplete" }) {
  const config = {
    complete: { color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/15", icon: CheckCircle2, label: "Submitted" },
    pending: { color: "text-amber-400 bg-amber-500/10 border-amber-500/15", icon: Clock, label: "Pending" },
    incomplete: { color: "text-rose-400 bg-rose-500/10 border-rose-500/15", icon: AlertCircle, label: "Incomplete" },
  };
  const { color, icon: Icon, label } = config[status];

  return (
    <span className={`inline-flex items-center gap-1 border px-1.5 py-0.5 text-[9px] font-medium ${color}`}>
      <Icon size={9} />
      {label}
    </span>
  );
}

function DashboardMockup() {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [hoveredReq, setHoveredReq] = useState<number | null>(null);

  const stats = [
    { label: "Total Requirements", value: "48", icon: FileText, trend: "+3 this week" },
    { label: "Submitted", value: "39", icon: CheckCircle2, trend: "81% completion" },
    { label: "Attendance Rate", value: "94%", icon: TrendingUp, trend: "+2% vs last month" },
  ];

  const requirements = [
    { name: "Research Paper Draft", subject: "STEM Research", status: "complete" as const, date: "Mar 15" },
    { name: "Math Problem Set 7", subject: "Pre-Calculus", status: "pending" as const, date: "Mar 20" },
    { name: "Lab Report — Titration", subject: "Chemistry", status: "incomplete" as const, date: "Mar 18" },
    { name: "Essay: Climate Action", subject: "English", status: "complete" as const, date: "Mar 12" },
    { name: "Project Proposal", subject: "ICT", status: "pending" as const, date: "Mar 25" },
  ];

  return (
    <div className="flex h-full">
      <Sidebar activeLabel="Dashboard" />
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.04] px-3 py-2">
          <div>
            <p className="text-[9px] text-slate-600">Welcome back,</p>
            <p className="text-[11px] font-medium text-slate-200">Student Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell size={12} className="text-slate-600" />
              <span className="absolute -right-0.5 -top-0.5 h-1 w-1 rounded-full bg-blue-400" />
            </div>
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500" />
          </div>
        </div>

        <div className="p-3">
          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-1.5">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  onMouseEnter={() => setHoveredStat(i)}
                  onMouseLeave={() => setHoveredStat(null)}
                  className={`border p-2.5 transition-all duration-200 ${
                    hoveredStat === i
                      ? "border-blue-500/15 bg-blue-500/[0.03] scale-[1.02]"
                      : "border-white/[0.04] bg-white/[0.01]"
                  }`}
                >
                  <Icon size={12} className={hoveredStat === i ? "text-blue-400" : "text-blue-400/60"} />
                  <p className="mt-1.5 font-display text-lg font-bold text-slate-100">{stat.value}</p>
                  <p className="text-[8px] text-slate-600">{stat.label}</p>
                  <p className="mt-0.5 text-[7px] text-emerald-400/60">{stat.trend}</p>
                </div>
              );
            })}
          </div>

          {/* Requirements table */}
          <div className="mt-2.5 border border-white/[0.04] bg-white/[0.01] p-2.5">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[9px] font-medium text-slate-300">Recent Requirements</p>
              <span className="text-[8px] text-blue-400 cursor-pointer hover:text-blue-300 transition-colors">View all</span>
            </div>
            <div className="space-y-0.5">
              {requirements.map((req, i) => (
                <div
                  key={req.name}
                  onMouseEnter={() => setHoveredReq(i)}
                  onMouseLeave={() => setHoveredReq(null)}
                  className={`flex items-center justify-between px-1.5 py-1 transition-colors ${
                    hoveredReq === i ? "bg-blue-500/[0.03]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 bg-blue-500/10 flex items-center justify-center">
                      <FileText size={9} className="text-blue-400/60" />
                    </div>
                    <div>
                      <p className="text-[9px] font-medium text-slate-200">{req.name}</p>
                      <p className="text-[7px] text-slate-600">{req.subject} · Due {req.date}</p>
                    </div>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RequirementsMockup() {
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const requirements = [
    { name: "Research Paper Draft", subject: "STEM Research", status: "complete" as const, due: "Mar 15", submitted: "Mar 14" },
    { name: "Math Problem Set 7", subject: "Pre-Calculus", status: "pending" as const, due: "Mar 20", submitted: null },
    { name: "Lab Report — Titration", subject: "Chemistry", status: "incomplete" as const, due: "Mar 18", submitted: null },
    { name: "Essay: Climate Action", subject: "English", status: "complete" as const, due: "Mar 12", submitted: "Mar 11" },
    { name: "Project Proposal", subject: "ICT", status: "pending" as const, due: "Mar 25", submitted: null },
    { name: "Reading Reflection", subject: "Filipino", status: "complete" as const, due: "Mar 10", submitted: "Mar 9" },
  ];

  const tabs = ["All", "Pending", "Submitted", "Incomplete"];

  return (
    <div className="flex h-full">
      <Sidebar activeLabel="Requirements" />
      <div className="flex-1 overflow-hidden">
        <div className="border-b border-white/[0.04] px-3 py-2">
          <p className="text-[11px] font-medium text-slate-200">My Requirements</p>
          <p className="text-[9px] text-slate-600">Track and manage all school requirements</p>
        </div>
        <div className="p-3">
          <div className="mb-2.5 flex gap-1.5">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-2 py-0.5 text-[8px] font-medium transition-all duration-200 ${
                  activeTab === i
                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/15"
                    : "text-slate-600 border border-white/[0.04] hover:text-slate-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-1 overflow-hidden">
            {requirements.map((req, i) => (
              <div
                key={req.name}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`flex items-center justify-between border px-2.5 py-1.5 transition-all duration-200 ${
                  hoveredRow === i ? "border-blue-500/10 bg-blue-500/[0.02]" : "border-white/[0.04] bg-white/[0.01]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-blue-500/10 flex items-center justify-center shrink-0">
                    <FileText size={10} className="text-blue-400/60" />
                  </div>
                  <div>
                    <p className="text-[9px] font-medium text-slate-200">{req.name}</p>
                    <p className="text-[7px] text-slate-600">{req.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-[7px] text-slate-600">Due {req.due}</p>
                    {req.submitted && <p className="text-[7px] text-emerald-400/60">Submitted {req.submitted}</p>}
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceMockup() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const students = [
    { name: "Maria Santos", id: "SHS-001", status: "present", initials: "MS" },
    { name: "Juan Dela Cruz", id: "SHS-002", status: "present", initials: "JD" },
    { name: "Ana Reyes", id: "SHS-003", status: "absent", initials: "AR" },
    { name: "Carlos Lopez", id: "SHS-004", status: "present", initials: "CL" },
    { name: "Sofia Garcia", id: "SHS-005", status: "late", initials: "SG" },
    { name: "Pedro Ramos", id: "SHS-006", status: "present", initials: "PR" },
    { name: "Liza Fernandez", id: "SHS-007", status: "present", initials: "LF" },
  ];

  const statusConfig = {
    present: { color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/15", dot: "bg-emerald-400", label: "Present" },
    absent: { color: "text-rose-400 bg-rose-500/10 border-rose-500/15", dot: "bg-rose-400", label: "Absent" },
    late: { color: "text-amber-400 bg-amber-500/10 border-amber-500/15", dot: "bg-amber-400", label: "Late" },
  };

  return (
    <div className="flex h-full">
      <Sidebar activeLabel="Attendance" />
      <div className="flex-1 overflow-hidden">
        <div className="border-b border-white/[0.04] px-3 py-2">
          <p className="text-[11px] font-medium text-slate-200">Attendance — Grade 11 STEM</p>
          <p className="text-[9px] text-slate-600">March 15, 2025 · Homeroom</p>
        </div>
        <div className="p-3">
          <div className="mb-2.5 flex gap-1.5">
            <div className="flex-1 border border-emerald-500/15 bg-emerald-500/[0.03] p-2 transition-all hover:bg-emerald-500/[0.06]">
              <p className="font-display text-lg font-bold text-emerald-400">24</p>
              <p className="text-[7px] text-slate-600">Present</p>
            </div>
            <div className="flex-1 border border-amber-500/15 bg-amber-500/[0.03] p-2 transition-all hover:bg-amber-500/[0.06]">
              <p className="font-display text-lg font-bold text-amber-400">2</p>
              <p className="text-[7px] text-slate-600">Late</p>
            </div>
            <div className="flex-1 border border-rose-500/15 bg-rose-500/[0.03] p-2 transition-all hover:bg-rose-500/[0.06]">
              <p className="font-display text-lg font-bold text-rose-400">1</p>
              <p className="text-[7px] text-slate-600">Absent</p>
            </div>
          </div>

          <div className="space-y-1">
            {students.map((s, i) => {
              const cfg = statusConfig[s.status as keyof typeof statusConfig];
              return (
                <button
                  key={s.id}
                  onClick={() => setSelected(selected === s.id ? null : s.id)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className={`flex w-full items-center justify-between border px-2.5 py-1.5 text-left transition-all duration-200 ${
                    selected === s.id
                      ? "border-blue-500/15 bg-blue-500/[0.03]"
                      : hovered === i
                      ? "border-white/[0.08] bg-white/[0.03]"
                      : "border-white/[0.04] bg-white/[0.01]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-[8px] font-medium text-slate-300">
                      {s.initials}
                    </div>
                    <div>
                      <p className="text-[9px] font-medium text-slate-200">{s.name}</p>
                      <p className="text-[7px] text-slate-600">{s.id}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 border px-1.5 py-0.5 text-[8px] font-medium ${cfg.color}`}>
                    <span className={`h-1 w-1 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsMockup() {
  const [read, setRead] = useState<Record<number, boolean>>({});
  const [hovered, setHovered] = useState<number | null>(null);

  const notifications = [
    { type: "requirement", title: "New requirement assigned", desc: "Math Problem Set 7 — due Mar 20", time: "2m ago", unread: true },
    { type: "attendance", title: "Attendance updated", desc: "Your attendance for Mar 15 has been recorded", time: "1h ago", unread: true },
    { type: "reminder", title: "Incomplete requirement reminder", desc: "Lab Report — Titration is overdue", time: "3h ago", unread: true },
    { type: "general", title: "Announcement", desc: "Parent-teacher conference on Mar 22", time: "1d ago", unread: false },
  ];

  const typeIcons = {
    requirement: FileText,
    attendance: Calendar,
    reminder: AlertCircle,
    general: Bell,
  };

  return (
    <div className="flex h-full">
      <Sidebar activeLabel="Notifications" />
      <div className="flex-1 overflow-hidden">
        <div className="border-b border-white/[0.04] px-3 py-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-200">Notifications</p>
              <p className="text-[9px] text-slate-600">3 unread</p>
            </div>
            <button
              onClick={() => setRead({ 0: true, 1: true, 2: true })}
              className="text-[8px] text-blue-400 hover:text-blue-300 transition-colors"
            >
              Mark all read
            </button>
          </div>
        </div>
        <div className="p-3">
          <div className="space-y-1.5">
            {notifications.map((notif, i) => {
              const Icon = typeIcons[notif.type as keyof typeof typeIcons];
              const isUnread = notif.unread && !read[i];
              return (
                <div
                  key={i}
                  onClick={() => setRead((prev) => ({ ...prev, [i]: true }))}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className={`flex cursor-pointer gap-2 border px-2.5 py-2 transition-all duration-200 ${
                    isUnread
                      ? "border-blue-500/10 bg-blue-500/[0.03]"
                      : "border-white/[0.04] bg-white/[0.01]"
                  } ${hovered === i ? "scale-[1.01]" : ""}`}
                >
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center ${
                    isUnread ? "bg-blue-500/15" : "bg-white/5"
                  }`}>
                    <Icon size={10} className={isUnread ? "text-blue-400" : "text-slate-600"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[9px] font-medium text-slate-200 truncate">{notif.title}</p>
                      <span className="text-[7px] text-slate-600 shrink-0">{notif.time}</span>
                    </div>
                    <p className="mt-0.5 text-[8px] text-slate-600 truncate">{notif.desc}</p>
                  </div>
                  {isUnread && <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-blue-400" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const mockups: Record<MockupVariant, () => React.JSX.Element> = {
  dashboard: DashboardMockup,
  requirements: RequirementsMockup,
  attendance: AttendanceMockup,
  notifications: NotificationsMockup,
};

const variantLabels: Record<MockupVariant, string> = {
  dashboard: "Main Dashboard",
  requirements: "Student Requirements",
  attendance: "Attendance Monitoring",
  notifications: "Notifications",
};

export function ProjectMockup({ variant }: ProjectMockupProps) {
  const MockupComponent = mockups[variant];

  return (
    <div className="overflow-hidden border border-white/[0.08] bg-[#070a12] shadow-2xl shadow-black/30">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-white/[0.04] bg-[#060912] px-3 py-2">
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-rose-500/30" />
          <div className="h-2 w-2 rounded-full bg-amber-500/30" />
          <div className="h-2 w-2 rounded-full bg-emerald-500/30" />
        </div>
        <div className="ml-2.5 flex items-center gap-1.5 bg-white/[0.03] px-2.5 py-0.5">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-400/40" />
          <span className="font-mono text-[8px] text-slate-600">track.kiwalan.edu.ph</span>
        </div>
        <span className="ml-auto text-[8px] text-slate-700">{variantLabels[variant]}</span>
      </div>

      {/* App content */}
      <div className="h-[420px] sm:h-[500px] lg:h-[540px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={variant}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full"
          >
            <MockupComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export { variantLabels };
export type { MockupVariant };
