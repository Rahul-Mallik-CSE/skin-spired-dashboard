/** @format */
"use client";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  useGetAllLinksQuery,
  useCreateLinkMutation,
  useUpdateLinkMutation,
  useDeleteLinkMutation,
} from "@/redux/feature/uploadLinksAPI";
import { Plus, Trash2, Edit, X, ExternalLink } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

// Types
interface Link {
  _id: string;
  link: string[];
  createdAt: string;
  updatedAt: string;
}

const UploadLinksPage = () => {
  return (
    <main className="bg-background2 w-full p-4 md:p-6">
      <section>
        <LinksTable />
      </section>
    </main>
  );
};

export default UploadLinksPage;

function LinksTable() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  // Form state for links
  const [linkUrls, setLinkUrls] = useState<string[]>([""]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // API hooks
  const { data, isLoading, error } = useGetAllLinksQuery({
    page: 1,
    limit: 1000,
    search: "",
  });

  const [createLink, { isLoading: isCreating }] = useCreateLinkMutation();
  const [updateLink, { isLoading: isUpdating }] = useUpdateLinkMutation();
  const [deleteLink] = useDeleteLinkMutation();

  const allLinks: Link[] = data?.data?.result || [];

  // Filter links based on search term
  const filteredLinks = allLinks.filter((linkItem) => {
    if (!debouncedSearchTerm || debouncedSearchTerm.trim() === "") {
      return true;
    }

    const searchLower = debouncedSearchTerm.toLowerCase().trim();
    return linkItem.link.some((url) => url.toLowerCase().includes(searchLower));
  });

  // Pagination for filtered results
  const totalItems = filteredLinks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const links = filteredLinks.slice(startIndex, endIndex);

  // Load link data when editing
  useEffect(() => {
    if (selectedLinkId && isEditMode) {
      const linkItem = allLinks.find((l) => l._id === selectedLinkId);
      if (linkItem) {
        setLinkUrls(linkItem.link.length > 0 ? linkItem.link : [""]);
      }
    } else if (!selectedLinkId && isModalOpen) {
      setLinkUrls([""]);
    }
  }, [selectedLinkId, isModalOpen, isEditMode, allLinks]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const openCreateModal = () => {
    setSelectedLinkId(null);
    setIsModalOpen(true);
    setIsEditMode(false);
    setLinkUrls([""]);
  };

  const openEditModal = (linkId: string) => {
    setSelectedLinkId(linkId);
    setIsModalOpen(true);
    setIsEditMode(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLinkId(null);
    setIsEditMode(false);
    setLinkUrls([""]);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const addLinkField = () => {
    setLinkUrls([...linkUrls, ""]);
  };

  const removeLinkField = (index: number) => {
    if (linkUrls.length > 1) {
      const newUrls = linkUrls.filter((_, i) => i !== index);
      setLinkUrls(newUrls);
    }
  };

  const updateLinkUrl = (index: number, value: string) => {
    const newUrls = [...linkUrls];
    newUrls[index] = value;
    setLinkUrls(newUrls);
  };

  const validateUrls = (urls: string[]): boolean => {
    const nonEmptyUrls = urls.filter((url) => url.trim() !== "");

    if (nonEmptyUrls.length === 0) {
      toast.error("Please add at least one link");
      return false;
    }

    // Basic URL validation
    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const invalidUrls = nonEmptyUrls.filter((url) => !urlPattern.test(url));

    if (invalidUrls.length > 0) {
      toast.error("Please enter valid URLs");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    const validUrls = linkUrls.filter((url) => url.trim() !== "");

    if (!validateUrls(linkUrls)) {
      return;
    }

    try {
      if (isEditMode && selectedLinkId) {
        await updateLink({
          id: selectedLinkId,
          data: { link: validUrls },
        }).unwrap();
        toast.success("Links updated successfully");
      } else {
        await createLink({ link: validUrls }).unwrap();
        toast.success("Links created successfully");
      }
      closeModal();
    } catch (error: any) {
      console.error("Error saving links:", error);
      toast.error(error?.data?.message || "Failed to save links");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this link group?")) {
      try {
        await deleteLink(id).unwrap();
        toast.success("Links deleted successfully");
      } catch (error: any) {
        console.error("Error deleting links:", error);
        toast.error(error?.data?.message || "Failed to delete links");
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        <p>Error loading links. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upload Links</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your website links
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="flex items-center gap-2"
          disabled={allLinks.length >= 1}
        >
          <Plus className="h-4 w-4" />
          Add Links
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder="Search links..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No.</TableHead>
              <TableHead>Links</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "No links found"
                      : "No links yet. Add your first link!"}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              links.map((linkItem, index) => (
                <TableRow key={linkItem._id}>
                  <TableCell className="font-medium">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {linkItem.link.map((url, urlIndex) => (
                        <a
                          key={urlIndex}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {url}
                        </a>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(linkItem.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(linkItem._id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(linkItem._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
            {totalItems} entries
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {isEditMode ? "Edit Links" : "Add New Links"}
                </h2>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Links</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addLinkField}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add More
                    </Button>
                  </div>
                  {linkUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => updateLinkUrl(index, e.target.value)}
                        className="flex-1 text-black"
                      />
                      {linkUrls.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeLinkField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isCreating || isUpdating}
                >
                  {isCreating || isUpdating
                    ? "Saving..."
                    : isEditMode
                      ? "Update Links"
                      : "Create Links"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
