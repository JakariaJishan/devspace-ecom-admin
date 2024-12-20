import { Input } from "@/components/ui/input"
import {useState} from "react";
import {Button} from "@/components/ui/button";
import usePostData from "@/app/hooks/usePostData";
import toast from "react-hot-toast";
import useUpdateData from "@/app/hooks/useUpdateData";
import {useRouter} from "next/navigation";

const CreateColorForm = ({color, mode, fetchColor, setColorList, colorList}) => {
  const router = useRouter();
  const {postData} = usePostData()
  const {updateData} = useUpdateData()
  const [colorName, setColorName] = useState(mode === "edit" ? fetchColor?.name : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("color[hex_code]", color);
    form.append("color[name]", colorName);

    if(mode === "create"){
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/colors`;
      postData(apiUrl, form).then(res => {
        setColorList([res.data,...colorList]);
        toast.success(res.message);
      }).catch(err => {
        toast.error(err.message);
      })
    }else if(mode === "edit"){
      const form = {
        color: {
          name: colorName,
          hex_code: color,
        },
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/colors/${fetchColor?.id}`;
      updateData(apiUrl, form).then(res => {
        toast.success(res.message);
        router.back()
      }).catch(err => {
        toast.error(err.message);
      })
    }
  }

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