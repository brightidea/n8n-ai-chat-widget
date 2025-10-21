# Publishing to GitHub Packages

This package is published to GitHub Packages registry as a private package.

## Prerequisites

1. **GitHub Personal Access Token (PAT)**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a descriptive name (e.g., "npm-github-packages")
   - Select the following scopes:
     - `write:packages` - Upload packages to GitHub Package Registry
     - `read:packages` - Download packages from GitHub Package Registry
     - `delete:packages` - Delete packages from GitHub Package Registry (optional)
     - `repo` - Full control of private repositories (required for private packages)
   - Click "Generate token"
   - **Copy the token immediately** (you won't be able to see it again)

## Automatic Publishing (via GitHub Actions)

The package is automatically published when you create a new release:

### Method 1: Create a GitHub Release

1. Go to your repository on GitHub
2. Click on "Releases" → "Create a new release"
3. Create a new tag (e.g., `v1.0.1`)
4. Fill in the release title and description
5. Click "Publish release"
6. GitHub Actions will automatically build and publish the package

### Method 2: Manual Trigger

You can also manually trigger the workflow:

1. Go to Actions tab in your repository
2. Select "Publish Package to GitHub Packages" workflow
3. Click "Run workflow"
4. Optionally specify a version (e.g., `1.0.1`)
5. Click "Run workflow"

## Manual Publishing (Local)

If you need to publish manually from your local machine:

1. **Set up authentication:**
   ```bash
   # Create or edit ~/.npmrc
   echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc
   ```

2. **Build the package:**
   ```bash
   npm run build
   ```

3. **Publish:**
   ```bash
   npm publish
   ```

## Installing the Package

Since this is a private package, users need to authenticate before installing.

### For End Users

1. **Create a Personal Access Token** (as described above, but only `read:packages` scope is needed)

2. **Configure npm to use GitHub Packages:**

   Create or edit `~/.npmrc` in your home directory:
   ```
   @brightidea:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
   ```

3. **Install the package:**
   ```bash
   npm install @brightidea/n8n-ai-chat-widget
   ```

### In a Project

Add a `.npmrc` file to your project root:
```
@brightidea:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Then set the environment variable before installing:
```bash
export NODE_AUTH_TOKEN=your_github_token
npm install
```

Or for CI/CD (like GitHub Actions):
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    registry-url: 'https://npm.pkg.github.com'
    scope: '@brightidea'

- name: Install dependencies
  run: npm install
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Version Management

This package follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

To update the version:
```bash
# Patch release (1.0.0 → 1.0.1)
npm version patch

# Minor release (1.0.0 → 1.1.0)
npm version minor

# Major release (1.0.0 → 2.0.0)
npm version major
```

Then create a release on GitHub with the new version tag.

## Troubleshooting

### "Unable to authenticate"
- Verify your GitHub token has the correct permissions
- Make sure the token hasn't expired
- Check that your `.npmrc` is correctly configured

### "Package not found"
- Ensure you have access to the private repository
- Verify the package name is correct: `@brightidea/n8n-ai-chat-widget`
- Check that your authentication is set up correctly

### "Permission denied"
- Make sure your GitHub token has `write:packages` permission
- Verify you have write access to the repository

## Additional Resources

- [GitHub Packages Documentation](https://docs.github.com/en/packages)
- [npm Registry Documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
