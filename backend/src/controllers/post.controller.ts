import { Request, Response, NextFunction } from "express";
import PostService from "../services/post.service";
import { getPaginationParams, getPaginationMeta } from "../utils/pagination";

class PostController {
  private postService = new PostService();

  public getAllPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { page, limit, skip } = getPaginationParams(req.query);
      const summaryOnly = req.query.summaryOnly === "true";

      const { posts, count } = await this.postService.getAllPosts(
        skip,
        limit,
        summaryOnly
      );

      const meta = getPaginationMeta(count, page, limit);

      res.status(200).json({
        data: posts,
        meta,
        message: "findPosts",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public getPostBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const slug = req.params.slug;
      const post = await this.postService.getPostBySlug(slug);
      if (!post) {
        res.status(404).json({ message: "Post not found" });
      } else {
        res.status(200).json(post);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public createPost = async (req: Request, res: Response): Promise<void> => {
    try {
      const post = await this.postService.createPost(req.body);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const post = await this.postService.updatePost(id, req.body);
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const post = await this.postService.deletePost(id);
      res.status(200).json({ message: "Post deleted successfully", post });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

export default PostController;
