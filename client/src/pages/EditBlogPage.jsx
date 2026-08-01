import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogForm from "../components/blogs/BlogForm";
import { getBlog, editBlog } from "../lib/blogs/blogs";

function EditBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBlog(id);
        setBlog(data.blog);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (payload) => {
    await editBlog(id, payload);
    navigate(`/blog/${id}`);
  };

  return (
    <section className="min-h-screen pt-20 pb-16 lg:pt-24 lg:pb-24 bg-teal-950 font-['Bricolage_Grotesque']">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
            Update your story
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">
            Edit blog
          </h1>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error || !blog ? (
          <p className="text-white/60 text-center">{error || "Blog not found."}</p>
        ) : (
          <BlogForm blog={blog} onSubmit={handleSubmit} />
        )}
      </div>
    </section>
  );
}

export default EditBlogPage;
