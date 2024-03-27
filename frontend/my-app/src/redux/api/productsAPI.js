import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["Product", "AdminProducts", "Reviews"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params: {
          page: params?.page,
          keyword: params?.keyword,
          category: params?.category,
          "price[gte]": params.min,
          "price[lte]": params.max,
          "ratings[gte]": params.ratings,
        },
      }),
    }),

    getProductsDetails: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ["Product"],
    }),

    submitReview: builder.mutation({
      query: (body) => {
        return {
          url: "/reviews",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Product"],
    }),

    canUserReview: builder.query({
      query: (productId) => `/can_review/?productId=${productId}`,
    }),


    getAdminProduct: builder.query({
      query: () => `/admin/products`,
      providesTags: "AdminProducts",
    }),
     
    createProduct: builder.mutation({
      query: (body) => {
        return {
          url: "/admin/products",
          method: "POST",
          body,
        };
      },

      invalidatesTags: ["AdminProducts"], 
  
    }),

     updateProduct: builder.mutation({
      query: ({ id, body }) => {
        return {
          url: `/admin/products/${id}`,
          method: "PUT",
          body,
        };
      },

      invalidatesTags: ["AdminProducts", "Product"], 
  
    }),

    
    uploadProductImages: builder.mutation({
      query: ({ id, body }) => {
        return {
          url: `/admin/products/${id}/upload_images`,
          method: "PUT",
          body,
        };
      },

      invalidatesTags: ["Product"], 
  
    }),

    deleteProductImages: builder.mutation({
      query: ({ id, body }) => {
        return {
          url: `/admin/products/${id}/delete_images`,
          method: "PUT",
          body,
        };
      },

      invalidatesTags: ["Product"], 
  
    }),


    deleteProduct: builder.mutation({
      query (id)  {
        return {
          url: `/admin/products/${id}`,
          method: "DELETE",

        };
      },

      invalidatesTags: ["AdminProducts"], 
  
    }),

    getProductReviews: builder.query({
      query: (ProductId) => `/reviews?id=${ProductId}`,
      providesTags: ["Reviews"],
      
    }),

    
    deleteReview: builder.mutation({
    query ({ productId ,id})  {
        return {
          url: `/admin/reviews?productId=${productId}&id=${id}`,
          method: "DELETE",

        };
      },

      invalidatesTags: ["Reviews"], 
  
    }),


  }),
});

export const { 
  useGetProductsQuery, 
  useGetProductsDetailsQuery, 
  useSubmitReviewMutation, 
  useCanUserReviewQuery, 
  useGetAdminProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImagesMutation,
  useDeleteProductImagesMutation,
  useDeleteProductMutation,
  useLazyGetProductReviewsQuery,
  useDeleteReviewMutation,

} = productApi;
