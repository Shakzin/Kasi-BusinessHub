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
  Building2,
  Plus,
  Search,
  Pencil,
  Trash2,

  MapPin,



  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  "Restaurant",
  "Retail",
  "Services",
  "Technology",
  "Health",
  "Education",
  "Entertainment",
  "Other",
];

interface BusinessFormData {
  name: string;
  category: string;
  description: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  imageUrl: string;
}

const emptyForm: BusinessFormData = {
  name: "",
  category: "",
  description: "",
  location: "",
  phone: "",
  email: "",
  website: "",
  imageUrl: "",
};

export default function Businesses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const ownerId = user?.unionId || String(user?.id);
  const utils = trpc.useUtils();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null);
  const [formData, setFormData] = useState<BusinessFormData>(emptyForm);

  const { data, isLoading } = trpc.business.list.useQuery({
    ownerId,
    search: search || undefined,
    category: categoryFilter || undefined,
    limit: 50,
  });

  const createMutation = trpc.business.create.useMutation({
    onSuccess: () => {
      utils.business.list.invalidate();
      utils.business.stats.invalidate();
      toast({ title: "Business created successfully" });
      setIsCreateOpen(false);
      setFormData(emptyForm);
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = trpc.business.update.useMutation({
    onSuccess: () => {
      utils.business.list.invalidate();
      toast({ title: "Business updated successfully" });
      setIsEditOpen(false);
      setSelectedBusiness(null);
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = trpc.business.delete.useMutation({
    onSuccess: () => {
      utils.business.list.invalidate();
      utils.business.stats.invalidate();
      utils.event.stats.invalidate();
      toast({ title: "Business deleted" });
      setIsDeleteOpen(false);
      setSelectedBusiness(null);
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      toast({ title: "Name and category are required", variant: "destructive" });
      return;
    }
    createMutation.mutate(formData);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness) return;
    updateMutation.mutate({ id: selectedBusiness, ...formData });
  };

  const handleDelete = () => {
    if (!selectedBusiness) return;
    deleteMutation.mutate({ id: selectedBusiness });
  };

  const openEdit = (biz: {
    id: number;
    name: string;
    category: string;
    description: string | null;
    location: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    imageUrl: string | null;
  }) => {
    setSelectedBusiness(biz.id);
    setFormData({
      name: biz.name,
      category: biz.category,
      description: biz.description || "",
      location: biz.location || "",
      phone: biz.phone || "",
      email: biz.email || "",
      website: biz.website || "",
      imageUrl: biz.imageUrl || "",
    });
    setIsEditOpen(true);
  };

  const openDelete = (id: number) => {
    setSelectedBusiness(id);
    setIsDeleteOpen(true);
  };

  const formContent = (
    <>
      <div className="space-y-2">
        <Label>
          Business Name <span className="text-[#DC2626]">*</span>
        </Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Your business name"
          className="border-[#E7E5E4]"
        />
      </div>
      <div className="space-y-2">
        <Label>
          Category <span className="text-[#DC2626]">*</span>
        </Label>
        <Select
          value={formData.category}
          onValueChange={(v) => setFormData({ ...formData, category: v })}
        >
          <SelectTrigger className="border-[#E7E5E4]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
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
          placeholder="Describe your business..."
          className="border-[#E7E5E4] min-h-[80px]"
          maxLength={500}
        />
        <p className="text-xs text-[#A8A29E]">{formData.description.length}/500</p>
      </div>
      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Business address"
          className="border-[#E7E5E4]"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Phone number"
            className="border-[#E7E5E4]"
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Business email"
            className="border-[#E7E5E4]"
            type="email"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Website</Label>
        <Input
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          placeholder="https://example.com"
          className="border-[#E7E5E4]"
        />
      </div>
      <div className="space-y-2">
        <Label>Cover Image URL</Label>
        <Input
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
          className="border-[#E7E5E4]"
        />
      </div>
    </>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C1917]">My Businesses</h1>
          <p className="text-[#78716C] text-sm mt-0.5">
            Manage your business listings
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
          Add Business
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A29E]" />
          <Input
            placeholder="Search businesses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-[#E7E5E4]"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px] border-[#E7E5E4]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
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
            <Building2 className="h-12 w-12 text-[#E7E5E4] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#1C1917] mb-2">
              No businesses yet
            </h3>
            <p className="text-[#78716C] text-sm mb-4">
              Create your first business to get started
            </p>
            <Button
              className="bg-[#4F46E5] hover:bg-[#4338CA]"
              onClick={() => {
                setFormData(emptyForm);
                setIsCreateOpen(true);
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Business
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.items.map((biz) => (
            <Card
              key={biz.id}
              className="border-[#E7E5E4] overflow-hidden hover:shadow-md transition-all group"
            >
              {/* Cover */}
              <div className="h-40 bg-gradient-to-br from-[#EDE9FE] to-[#F5F3FF] relative overflow-hidden">
                {biz.imageUrl ? (
                  <img
                    src={biz.imageUrl}
                    alt={biz.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Building2 className="h-12 w-12 text-[#C4B5FD]" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
                    onClick={() => openEdit(biz)}
                  >
                    <Pencil className="h-3.5 w-3.5 text-[#57534E]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
                    onClick={() => openDelete(biz.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-[#DC2626]" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-[#1C1917] text-sm line-clamp-1">
                    {biz.name}
                  </h3>
                  <span className="text-[10px] bg-[#F5F5F3] text-[#78716C] px-2 py-0.5 rounded-full shrink-0">
                    {biz.category}
                  </span>
                </div>
                <p className="text-xs text-[#78716C] line-clamp-2 mb-3">
                  {biz.description || "No description"}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-[#A8A29E]">
                  {biz.location && (
                    <span className="flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" />
                      {biz.location.slice(0, 20)}
                    </span>
                  )}
                  <span className="flex items-center gap-0.5 ml-auto">
                    <Eye className="h-3 w-3" />
                    {biz.views} views
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
            <DialogTitle className="text-xl">Add Business</DialogTitle>
            <DialogDescription>
              Fill in the details to create your business profile.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            {formContent}
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
                {createMutation.isPending ? "Creating..." : "Create Business"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Business</DialogTitle>
            <DialogDescription>Update your business details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            {formContent}
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
              Delete Business?
            </DialogTitle>
            <DialogDescription>
              This will permanently delete this business and all associated
              events. This action cannot be undone.
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
