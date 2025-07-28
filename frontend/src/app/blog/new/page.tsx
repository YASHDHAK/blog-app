"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SelectItem } from '@/components/ui/select'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RefreshCw } from 'lucide-react'
import React, { useRef, useState,useMemo } from 'react'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { author_service, useAppData } from '@/context/AppContext'
import axios from 'axios'

const JoditEditor = dynamic(() => import('jodit-react'),{ssr:false})

export const blogCategories = [
    "Technology",
    "Health",
    "Finance",
    "Travel",
    "Education",
    "Entertainment",
    "Study",
]
const AddBlog = () => {


   const editor = useRef(null);
   const [content, setContent] = useState("");
    
   const {fetchBlogs} = useAppData();
   const [loading,setLoading] = useState(false);
   const[formData,setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    blogcontent: "",
   });
   const handleInputChange = (e:any) => {
    setFormData({...formData,[e.target.name] : e.target.value})
   }
   const handleFileChange = (e:any) => {
    const file = e.target.files[0];
    setFormData({...formData,image:file});
   };

  const handleSubmit = async(e : any) => {
   e.preventDefault();
   setLoading(true);
   const fromDataToSend = new FormData();
    fromDataToSend.append("title",formData.title);
    fromDataToSend.append("description", formData.description);
    fromDataToSend.append("blogcontent", formData.blogcontent);
    fromDataToSend.append("category", formData.category);
    if (formData.image) {
      fromDataToSend.append("file", formData.image);
    }
   try{
    const token = Cookies.get("token");
      const { data } = await axios.post(
        `${author_service}/api/v1/blog/new`,
        fromDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      setFormData({
        title: "",
        description: "",
        category: "",
        image: null,
        blogcontent: "",
      });
       setContent("");
       setTimeout(() => {
         fetchBlogs();
       },4000);
   }catch(error){   
    console.log(error); 
     toast.error("Error while adding blog");
   }finally{
    setLoading(false);
   }
   };

   const [aiTitle,setAiTitle] = useState(false);
   const aiTitleResponse = async() => {
    try{
        setAiTitle(true);
        const {data} = await axios.post(`${author_service}/api/v1/ai/title`,{
            text : formData.title
        })
        setFormData({...formData,title:data});
    }catch(error){
        toast.error("Problem from fetching from ai");
        console.log(error);
    }finally{
        setAiTitle(false);
    }
   }
  
   const [aiDescripiton, setAiDescription] = useState(false);

  const aiDescriptionResponse = async () => {
    try {
      setAiDescription(true);
      const { data } = await axios.post(
        `${author_service}/api/v1/ai/descripiton`,
        {
          title: formData.title,
          description: formData.description,
        }
      );
      setFormData({ ...formData, description: data });
    } catch (error) {
      toast.error("Problem while fetching from ai");
      console.log(error);
    } finally {
      setAiDescription(false);
    }
  };

     const [aiBlogLoading, setAiBlogLoading] = useState(false);

  const aiBlogResponse = async () => {
    try {
      setAiBlogLoading(true);
      const { data } = await axios.post(`${author_service}/api/v1/ai/blog`, {
        blog: formData.blogcontent,
      });
      setContent(data.html);
      setFormData({ ...formData, blogcontent: data.html });
    } catch (error: any) {
      toast.error("Problem while fetching from ai");
      console.log(error);
    } finally {
      setAiBlogLoading(false);
    }
  };


	const config = useMemo(() => ({
			readonly: false, 
			placeholder: 'Start typings...',
		}),
		[]
	);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
            <h2 className="text-2xl font-bold">
             Add New Blog
            </h2>
        </CardHeader>
        <CardContent>
         <form onSubmit={handleSubmit} className="space-y-4"> 
          <Label>Title</Label>
          <div className="flex justify-center items-center gap-2">
            <Input 
            name="title"
             value={formData.title}
            onChange={handleInputChange}
             placeholder="Enter Blog Title"
             className={aiTitle ? "animate-pulseplaceholder:opacity-60" : "" }
            required
            />
          {
            formData.title === ""?"" : <Button type="button"
            onClick={aiTitleResponse} disabled={aiTitle}
            >
           <RefreshCw className={aiTitle ? "animate-spin" : ""}/>
          </Button>
          }
          </div>
          <Label>Description</Label>
          <div className="flex justify-center items-center gap-2">
            <Input 
            name="description" 
            value={formData.description}
            onChange={handleInputChange}
             placeholder="Enter Blog Description"
            className={aiDescripiton ? "animate-pulseplaceholder:opacity-60" : "" } 
            required
            />
             {formData.title === "" ? (
                ""
              ) : (
                <Button
                  onClick={aiDescriptionResponse}
                  type="button"
                  disabled={aiDescripiton}
                >
           <RefreshCw className={aiDescripiton ? "animate-spin" : ""} />
          </Button>
              )}
          </div>
          <Label>Category</Label>
          <Select onValueChange={(value:any) => setFormData({...formData,category:value})}>
            <SelectTrigger>
                <SelectValue placeholder={formData.category || "Select Category"}></SelectValue>
                 </SelectTrigger>
                 <SelectContent>
               {blogCategories?.map((e,i) => (
                <SelectItem key={i} value={e}>
                    {e}
                </SelectItem>
               ))}
                 </SelectContent>
          </Select>

          <div>
            <Label>Image Upload</Label>
            <Input type="file" accept="image/*"
            onChange={handleFileChange}
            />
          </div>
          <div>
            <Label>Blog Content</Label>
            <div className="flex justify-between items-center mb-2">
             <p className="text-sm text-muted-foreground">
              Paste you blog or type here. You can use rich text formatting.
              Please add image after improving your grammer
             </p>
             <Button
               type="button"
               size={"sm"}
               onClick={aiBlogResponse}
               disabled={aiBlogLoading}
             >
            <RefreshCw size={16}
            className={aiBlogLoading ? "animate-spin" : ""}
            />
            <span className="ml-2">Fix Grammer</span>
             </Button>
            </div>
            <JoditEditor ref={editor} value={content} config={config}
            tabIndex={1} onBlur={(newContent)=>{
                setContent(newContent)
                setFormData({...formData,blogcontent:newContent});
            }} />
          </div>
          <Button 
          type="submit" className="w-full" disabled={loading}>
            
            {loading ? "Submitting" : "Submit"}
            
            </Button>
          </form> 
        </CardContent>
      </Card>
    </div>
  )
}

export default AddBlog
