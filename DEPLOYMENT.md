# Deployment Guide for Vercel

This guide explains how to deploy this Next.js e-commerce application to Vercel.

## Prerequisites

1. A Vercel account
2. Your project pushed to GitHub, GitLab, or Bitbucket
3. Supabase project with database configured

## Environment Variables Required

The application requires the following environment variables to be set in Vercel:

### Supabase Configuration

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## How to Deploy

### Step 1: Connect Repository to Vercel

1. Log into [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your repository from GitHub/GitLab/Bitbucket
4. Select the repository containing this project

### Step 2: Configure Environment Variables

1. In the Vercel project setup, go to **Settings** → **Environment Variables**
2. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key-from-supabase` | Production, Preview, Development |

### Step 3: Get Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** (for `NEXT_PUBLIC_SUPABASE_URL`)
   - **Public anon key** (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Step 4: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your application will be available at `https://your-project-name.vercel.app`

## Troubleshooting

### Build Errors

If you encounter `supabaseUrl is required` errors:

1. **Check Environment Variables**: Ensure all required environment variables are set in Vercel
2. **Variable Names**: Make sure variable names match exactly (case-sensitive)
3. **Scope**: Ensure variables are set for all environments (Production, Preview, Development)
4. **Redeploy**: After adding environment variables, trigger a new deployment

### Database Issues

If the application deploys but database operations fail:

1. **Supabase URL**: Verify the Supabase URL is correct and accessible
2. **API Key**: Check that the anon key has the required permissions
3. **Database Schema**: Ensure your Supabase database has the required tables:
   - `categories`
   - `products`
   - `cart_items` (if cart functionality is used)

### Performance Optimization

For better performance on Vercel:

1. **Enable Edge Runtime** for API routes (optional)
2. **Configure caching** for static assets
3. **Monitor build times** and optimize if necessary

## Environment Variables Template

Create a `.env.local` file for local development:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **Never commit `.env.local` to version control**

## Post-Deployment Checklist

- [ ] Application loads without errors
- [ ] API endpoints respond correctly
- [ ] Database operations work (categories, products)
- [ ] Admin functions accessible (if implemented)
- [ ] Search and filtering work on shop page
- [ ] Images load properly

## Support

If you continue to experience deployment issues:

1. Check Vercel deployment logs for specific errors
2. Verify Supabase configuration and permissions
3. Test API endpoints individually using browser dev tools
4. Review this deployment guide and ensure all steps were followed

## Automatic Deployments

Once configured, Vercel will automatically deploy:
- **Production**: When code is pushed to main/master branch
- **Preview**: When pull requests are created
- **Development**: When pushing to other branches (optional)