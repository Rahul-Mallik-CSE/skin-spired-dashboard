/** @format */

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

const UserQuestionsPage = () => {
  return (
    <>
      <div className="overflow-hidden bg-white rounded-md mx-6 mt-12">
        <div className="flex justify-between items-center px-3 pb-6">
          <h2 className="text-3xl font-medium text-primary py-6 px-3">
            Products List
          </h2>
          <Button className="bg-black text-white hover:bg-gray-800">
            <Plus className="h-4 w-4 mr-2" />
            Upload New Product
          </Button>
        </div>
      </div>
    </>
  );
};

export default UserQuestionsPage;
