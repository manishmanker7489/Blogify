const {Router} = require('express');
const multer = require('multer');
const path = require('path'); 
const Blog = require('../model/blog');
const Comment = require('../model/comment');

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    }
  })
  
  const upload = multer({ storage: storage })

router.get("/add-new",(req,res)=>{
    res.render("addBlog",{user: req.user})
})

router.post("/",upload.single('coverImage') , async (req,res)=>{
    
    const {title,body} = req.body;

   const blog = await Blog.create({
        title,
        body,
        createdBy:req.user._id,
        coverImageURL:`/uploads/${req.file.filename}`
    });

    return res.redirect(`/blog/${blog._id}`);
}) 


router.get("/:id" , async (req,res)=>{
  const blog = await Blog.findById(req.params.id).populate("createdBy") ;
  const comments = await Comment.find({ blogId: req.params.id}).populate("createdBy") ;
  // console.log(blog)
  // console.log(comments); 
  res.render('blog' , { user : req.user , blog : blog , comments:comments });
})
 

router.post("/comment/:blogId" , async (req,res)=>{
   await Comment.create({
    comment: req.body.comment,
    blogId:req.params.blogId,
    createdBy: req.user._id, 
  });

  return res.redirect(`/blog/${req.params.blogId}`);

} );
 
module.exports = router;