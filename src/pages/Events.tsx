import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Plus,
  Search,
  Pencil,
  Trash2,
  MapPin,
  Clock,
  Building2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EventFormData {
  title: string;
  description: string;
  businessId: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  imageUrl: string;
  status: "draft" | "published";
}

const emptyForm: EventFormData = {
  title: "",
  description: "",
  businessId: "",
  location: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  imageUrl: "",
  status: "draft",
};

export default function Events() {
  const { user } = useAuth();
  const { toast } = useToast();
  const ownerId = user?.unionId || String(user?.id);
  const utils = trpc.useUtils();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [formData, setFormData] = useState<EventFormData>(emptyForm);

  const { data: myBusinesses } = trpc.business.list.useQuery({ ownerId, limit: 100 });

  const { data, isLoading } = trpc.event.list.useQuery({
    ownerId,
    search: search || undefined,
    status: statusFilter || undefined,
    limit: 50,
  });

  const createMutation = trpc.event.create.useMutation({
    onSuccess: () => {
      utils.event.list.invalidate();
      utils.event.stats.invalidate();
      toast({ title: "Event created successfully" });
      setIsCreateOpen(false);
      setFormData(emptyForm);
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = trpc.event.update.useMutation({
    onSuccess: () => {
      utils.event.list.invalidate();
      toast({ title: "Event updated successfully" });
      setIsEditOpen(false);
      setSelectedEvent(null);
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = trpc.event.delete.useMutation({
    onSuccess: () => {
      utils.event.list.invalidate();
      utils.event.stats.invalidate();
      toast({ title: "Event deleted" });
      setIsDeleteOpen(false);
      setSelectedEvent(null);
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const parseDateTime = (date: string, time: string): Date => {
    return new Date(`${date}T${time || "00:00"}`);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.businessId || !formData.startDate) {
      toast({ title: "Title, business, and start date are required", variant: "destructive" });
      return;
    }
    createMutation.mutate({
      title: formData.title,
      description: formData.description || undefined,
      businessId: Number(formData.businessId),
      location: formData.location || undefined,
      startDate: parseDateTime(formData.startDate, formData.startTime),
      endDate: formData.endDate
        ? parseDateTime(formData.endDate, formData.endTime)
        : undefined,
      imageUrl: formData.imageUrl || undefined,
      status: formData.status,
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    updateMutation.mutate({
      id: selectedEvent,
      title: formData.title,
      description: formData.description || undefined,
      location: formData.location || undefined,
      startDate: formData.startDate
        ? parseDateTime(formData.startDate, formData.startTime)
        : undefined,
      endDate: formData.endDate
        ? parseDateTime(formData.endDate, formData.endTime)
        : undefined,
      imageUrl: formData.imageUrl || undefined,
      status: formData.status,
    });
  };

  const handleDelete = () => {
    if (!selectedEvent) return;
    deleteMutation.mutate({ id: selectedEvent });
  };

  const openEdit = (evt: {
    id: number;
    title: string;
    description: string | null;
    location: string | null;
    startDate: Date;
    endDate: Date | null;
    imageUrl: string | null;
    status: string;
    businessId: number;
  }) => {
    setSelectedEvent(evt.id);
    const start = new Date(evt.startDate);
    const end = evt.endDate ? new Date(evt.endDate) : null;
    setFormData({
      title: evt.title,
      description: evt.description || "",
      businessId: String(evt.businessId),
      location: evt.location || "",
      startDate: start.toISOString().split("T")[0],
      startTime: start.toTimeString().slice(0, 5),
      endDate: end ? end.toISOString().split("T")[0] : "",
      endTime: end ? end.toTimeString().slice(0, 5) : "",
      imageUrl: evt.imageUrl || "",
      status: evt.status as "draft" | "published",
    });
    setIsEditOpen(true);
  };

  const openDelete = (id: number) => {
    setSelectedEvent(id);
    setIsDeleteOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-[#ECFDF5] text-[#059669]";
      case "draft":
        return "bg-[#FFFBEB] text-[#D97706]";
      case "cancelled":
        return "bg-[#FFF1F2] text-[#DC2626]";
      default:
        return "bg-[#F5F5F4] text-[#78716C]";
    }
  };

  const eventFormContent = (isEdit: boolean) => (
    <>
      <div className="space-y-2">
        <Label>
          Event Name <span className="text-[#DC2626]">*</span>
        </Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Event title"
          className="border-[#E7E5E4]"
        />
      </div>
      <div className="space-y-2">
        <Label>
          Business <span className="text-[#DC2626]">*</span>
        </Label>
        <Select
          value={formData.businessId}
          onValueChange={(v) => setFormData({ ...formData, businessId: v })}
          disabled={isEdit}
        >
          <SelectTrigger className="border-[#E7E5E4]">
            <SelectValue placeholder="Select a business" />
          </SelectTrigger>
          <SelectContent>
            {myBusinesses?.items?.map((biz) => (
              <SelectItem key={biz.id} value={String(biz.id)}>
                {biz.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Event description..."
          className="border-[#E7E5E4] min-h-[60px]"
        />
      </div>
      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="Event location"
          className="border-[#E7E5E4]"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Start Date *</Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="border-[#E7E5E4]"
          />
        </div>
        <div className="space-y-2">
          <Label>Start Time</Label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
            className="border-[#E7E5E4]"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className="border-[#E7E5E4]"
          />
        </div>
        <div className="space-y-2">
          <Label>End Time</Label>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
            className="border-[#E7E5E4]"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Event Image URL</Label>
        <Input
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData({ ...formData, imageUrl: e.target.value })
          }
          placeholder="https://example.com/image.jpg"
          className="border-[#E7E5E4]"
        />
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={formData.status}
          onValueChange={(v: "draft" | "published") =>
            setFormData({ ...formData, status: v })
          }
        >
          <SelectTrigger className="border-[#E7E5E4]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C1917]">My Events</h1>
          <p className="text-[#78716C] text-sm mt-0.5">
            Manage your events and happenings
          </p>
        </div>
        <Button
          className="bg-[#4F46E5] hover:bg-[#4338CA]"
          onClick={() => {
            setFormData(emptyForm);
            setIsCreateOpen(true);
          }}
        >
          <Plus className="mr-1 h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A29E]" />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-[#E7E5E4]"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] border-[#E7E5E4]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : !data?.items?.length ? (
        <Card className="border-[#E7E5E4]">
          <CardContent className="py-16 text-center">
            <Calendar className="h-12 w-12 text-[#E7E5E4] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#1C1917] mb-2">
              No events yet
            </h3>
            <p className="text-[#78716C] text-sm mb-4">
              Create your first event for one of your businesses
            </p>
            <Button
              className="bg-[#4F46E5] hover:bg-[#4338CA]"
              onClick={() => {
                setFormData(emptyForm);
                setIsCreateOpen(true);
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              Create Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.items.map((evt) => (
            <Card
              key={evt.id}
              className="border-[#E7E5E4] overflow-hidden hover:shadow-md transition-all group"
            >
              {/* Cover */}
              <div className="h-36 bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] relative overflow-hidden">
                {evt.imageUrl ? (
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Calendar className="h-10 w-10 text-[#6EE7B7]" />
                  </div>
                )}
                {/* Date badge */}
                <div className="absolute top-2 left-2 bg-white rounded-lg px-2 py-1 text-center shadow-sm">
                  <div className="text-xs font-bold text-[#1C1917]">
                    {new Date(evt.startDate).toLocaleDateString("en", {
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-[10px] uppercase text-[#78716C]">
                    {new Date(evt.startDate).toLocaleDateString("en", {
                      month: "short",
                    })}
                  </div>
                </div>
                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
                    onClick={() => openEdit(evt)}
                  >
                    <Pencil className="h-3.5 w-3.5 text-[#57534E]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
                    onClick={() => openDelete(evt.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-[#DC2626]" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-[#1C1917] text-sm line-clamp-1 flex-1">
                    {evt.title}
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${getStatusColor(
                      evt.status
                    )}`}
                  >
                    {evt.status}
                  </span>
                </div>
                <p className="text-xs text-[#4F46E5] mb-2 flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {evt.businessName}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-[#A8A29E]">
                  {evt.location && (
                    <span className="flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" />
                      {evt.location.slice(0, 25)}
                    </span>
                  )}
                  <span className="flex items-center gap-0.5 ml-auto">
                    <Clock className="h-3 w-3" />
                    {new Date(evt.startDate).toLocaleTimeString("en", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Create Event</DialogTitle>
            <DialogDescription>
              Fill in the details to create your event.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            {eventFormContent(false)}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="border-[#E7E5E4]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#4F46E5] hover:bg-[#4338CA]"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Event</DialogTitle>
            <DialogDescription>Update your event details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            {eventFormContent(true)}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="border-[#E7E5E4]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#4F46E5] hover:bg-[#4338CA]"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#DC2626]">
              Delete Event?
            </DialogTitle>
            <DialogDescription>
              This will permanently delete this event. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="border-[#E7E5E4]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
