import AdminList from "@/app/components/admin/AdminList";
// import {useEffect} from "react";

const page = () => {
        //
        //
        // useEffect(() => {
        //     const fetchData = async () => {
        //         const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders`;
        //         const [err, data] ?= await fetch(apiUrl);
        //         console.log(data, err);
        //     }
        //     fetchData();
        // },[])
    return (
        <>
           <AdminList />
        </>
    )
}

export default page;