/** @format */

"use client";

import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import DetailRow from "@/components/DetailRow";
import {
  useGetAllUsersQuery,
  useUpdateUserDataMutation,
} from "@/redux/feature/userAPI";
import Loading from "@/components/Loading";
import { getFullImageUrl } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export default function DashboardContent() {
  return (
    <main className="bg-background2 w-full p-4 md:p-6">
      <section>
        <TransactionTable />
      </section>
    </main>
  );
}

function TransactionTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState<any>({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    isNotification: false,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useState<any>(null);

  const { data, isLoading } = useGetAllUsersQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const [updateUserData, { isLoading: isUpdating }] =
    useUpdateUserDataMutation();

  console.log(data);

  const transactions = data?.data?.result;

  const totalPages = Math.ceil(transactions?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions?.slice(startIndex, endIndex);

  const openUserModal = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      age: user.age?.toString() || "",
      gender: user.gender || "",
      isNotification: user.isNotification || false,
      image: null,
    });
    setImagePreview(user.image ? getFullImageUrl(user.image) : null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditForm({
      firstName: selectedUser.firstName || "",
      lastName: selectedUser.lastName || "",
      age: selectedUser.age?.toString() || "",
      gender: selectedUser.gender || "",
      isNotification: selectedUser.isNotification || false,
      image: null,
    });
    setImagePreview(
      selectedUser.image ? getFullImageUrl(selectedUser.image) : null
    );
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("firstName", editForm.firstName);
      formData.append("lastName", editForm.lastName);
      formData.append("age", editForm.age);
      formData.append("gender", editForm.gender);
      formData.append("isNotification", editForm.isNotification.toString());

      // Add image if a new one was selected
      if (editForm.image) {
        formData.append("image", editForm.image);
      }

      const result = await updateUserData({
        id: selectedUser._id,
        data: formData,
      }).unwrap();

      // Update selected user with new data
      setSelectedUser(result.data);
      setImagePreview(
        result.data.image ? getFullImageUrl(result.data.image) : null
      );
      setIsEditMode(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditForm((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditForm((prev: any) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setIsEditMode(false);
    setImagePreview(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="overflow-hidden bg-white rounded-md">
        <h2 className="text-[32px] font-medium text-primary py-6 px-3">
          User List
        </h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 text-black  py-8">
              <TableRow>
                <TableHead className="text-[#FFF] text-lg text-center">
                  User Image
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  User Name
                </TableHead>

                <TableHead className="text-[#FFF] text-lg text-center">
                  Email
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Join Date
                </TableHead>
                <TableHead className="text-[#FFF] text-lg text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentTransactions?.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="text-center text-black text-lg">
                    <div className="flex items-center justify-center gap-2">
                      <img
                        src={getFullImageUrl(user.image)}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-black text-lg">
                    <div className="flex items-center justify-center gap-2">
                      <span>{user.firstName || "Unknown User"}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center text-black text-lg">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-center text-black text-lg">
                    {user.createdAt.slice(0, 10)}
                  </TableCell>
                  <TableCell className="text-center text-black text-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => openUserModal(user)}
                    >
                      <Info className="h-6 w-6" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="max-w-sm mx-auto flex items-center justify-between border-t border-gray-200 rounded-lg bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 text-black  px-4 py-3 mt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Previous</span>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
            <span className="text-sm text-[#E6E6E6]">Previous</span>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    page === currentPage ? "bg-teal-800 text-white" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[#E6E6E6]">Next</span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Next</span>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md rounded-md bg-[#000000] px-6 py-6 shadow-lg">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>

            {/* User Image */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img
                  src={imagePreview || "/placeholder-avatar.png"}
                  alt={selectedUser.name}
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
                />
                {isEditMode && (
                  <label
                    htmlFor="image-upload"
                    className="absolute bottom-0 right-0 bg-[#45b1b4] hover:bg-[#5ce1e6b7] text-white rounded-full p-2 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </label>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Heading */}
            <h2 className="mb-6 text-center text-[30px] font-semibold text-[#E6E6E6]">
              User Details
            </h2>

            {/* User Details */}
            <div className="space-y-2">
              {isEditMode ? (
                <>
                  {/* Editable First Name and Last Name in one row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[#E6E6E6] text-sm">
                        First Name
                      </label>
                      <Input
                        value={editForm.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="bg-[#1a1a1a] text-[#E6E6E6] border-[#D1D5DB]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[#E6E6E6] text-sm">
                        Last Name
                      </label>
                      <Input
                        value={editForm.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="bg-[#1a1a1a] text-[#E6E6E6] border-[#D1D5DB]"
                      />
                    </div>
                  </div>

                  {/* Non-editable Join Date */}
                  <DetailRow
                    label="Join Date"
                    value={selectedUser?.createdAt.slice(0, 10)}
                  />

                  {/* Non-editable Email */}
                  <DetailRow label="Email" value={selectedUser?.email} />

                  {/* Editable Age */}
                  <div className="space-y-2">
                    <label className="text-[#E6E6E6] text-sm">Age</label>
                    <Input
                      type="number"
                      value={editForm.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className="bg-[#1a1a1a] text-[#E6E6E6] border-[#D1D5DB]"
                    />
                  </div>

                  {/* Editable Gender */}
                  <div className="space-y-2">
                    <label className="text-[#E6E6E6] text-sm">Gender</label>
                    <select
                      value={editForm.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      className="w-full bg-[#1a1a1a] text-[#E6E6E6] border border-[#D1D5DB] rounded-md px-3 py-2"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Editable Notification Switch */}
                  <div className="flex justify-between border-b border-[#D1D5DB] py-2">
                    <span className="text-[#E6E6E6]">Notification</span>
                    <Switch
                      checked={editForm.isNotification}
                      onCheckedChange={(checked) =>
                        handleInputChange("isNotification", checked)
                      }
                      className="data-[state=checked]:bg-[#45b1b4]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <DetailRow
                    label="User Name"
                    value={`${selectedUser?.firstName || ""} ${
                      selectedUser?.lastName || ""
                    }`}
                  />

                  <DetailRow
                    label="Join Date"
                    value={selectedUser?.createdAt.slice(0, 10)}
                  />
                  <DetailRow label="Email" value={selectedUser?.email} />
                  <DetailRow
                    label="Age"
                    value={selectedUser?.age?.toString() || "N/A"}
                  />
                  <DetailRow
                    label="Gender"
                    value={selectedUser?.gender || "N/A"}
                  />
                  <div className="flex justify-between border-b border-[#D1D5DB] py-2">
                    <span className="text-[#E6E6E6]">Notification</span>
                    <Switch
                      checked={selectedUser?.isNotification || false}
                      disabled
                      className="data-[state=checked]:bg-[#45b1b4]"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-2">
              {isEditMode ? (
                <>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="flex-1 border-[#D1D5DB]  text-black hover:bg-gray-100"
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-[#45b1b4] hover:bg-[#5ce1e6b7]"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={closeModal}
                    variant="outline"
                    className="flex-1 border-[#D1D5DB] text-black hover:bg-gray-100"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handleEditClick}
                    className="flex-1 bg-[#45b1b4] hover:bg-[#5ce1e6b7]"
                  >
                    Edit
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
