import { Input } from "@/components/ui/input"
import {useState} from "react";
import {Button} from "@/components/ui/button";
import usePostData from "@/app/hooks/usePostData";
import toast from "react-hot-toast";
import useUpdateData from "@/app/hooks/useUpdateData";
import {useRouter} from "next/navigation";
import {getCookie} from "@/app/utils";

const CreateColorForm = ({color, mode, fetchColor, setColorList, colorList}) => {
  const router = useRouter();
  const {postData} = usePostData()
  const {updateData} = useUpdateData()
  const [colorName, setColorName] = useState(mode === "edit" ? fetchColor?.name : "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "create") {
      const form = new FormData();
      form.append("color[hex_code]", color);
      form.append("color[name]", colorName);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/colors`;
      postData(apiUrl, form)
          .then((res) => {
            setColorList([res.data, ...colorList]);
            toast.success(res.message);
          })
          .catch((err) => {
            toast.error(err.message);
          });
    } else if (mode === "edit") {
      try {
        // Construct the payload for the edit mode
        const payload = JSON.stringify({
          color: {
            name: colorName,
            hex_code: color,
          },
        });

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/colors/${fetchColor?.id}`;

        // Fetch token from cookies
        const token = getCookie("token");

        // Send PATCH request for updating the color
        const response = await fetch(apiUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json", // Specify JSON content type
            Authorization: `Bearer ${token}`, // Add authorization token
          },
          body: payload,
        });

        // Handle response
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update color");
        }

        const responseData = await response.json();

        // Show success message and navigate back
        toast.success(responseData.message || "Color updated successfully!");
        router.back();
      } catch (err) {
        // Show error message
        toast.error(err.message || "Failed to update color");
      }
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-8 mt-4">
      <div>
        <label htmlFor="hex_code">Hex code</label>
        <Input
          type="text"
          placeholder=""
          className=""
          value={color}
        />
      </div>
      <div>
        <label htmlFor="name">name</label>
        <Input
          type="text"
          name="name"
          className=""
          required
          defaultValue={mode === 'edit' ? fetchColor?.name : ""}
          onChange={(e) => setColorName(e.target.value)}
        />
      </div>
      <Button type="submit">Save</Button>
    </form>
  )
}

export default CreateColorForm;