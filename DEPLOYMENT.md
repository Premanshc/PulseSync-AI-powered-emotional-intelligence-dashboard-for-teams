# PulseSync - Azure Deployment Guide

This guide will help you deploy the PulseSync Next.js application to Azure App Service using Azure DevOps pipelines.

## Prerequisites

1. **Azure Subscription** - Active Azure subscription
2. **Azure DevOps Account** - Access to Azure DevOps organization
3. **Azure App Service** - Created App Service instance
4. **Service Principal** - For Azure DevOps to deploy to Azure

## Step 1: Create Azure Resources

### 1.1 Create Resource Group
```bash
az group create --name pulsesync-rg --location "East US"
```

### 1.2 Create App Service Plan
```bash
az appservice plan create \
  --name pulsesync-plan \
  --resource-group pulsesync-rg \
  --sku B1 \
  --is-linux
```

### 1.3 Create Web App
```bash
az webapp create \
  --name pulsesync-app \
  --resource-group pulsesync-rg \
  --plan pulsesync-plan \
  --runtime "NODE|18-lts"
```

## Step 2: Configure Azure DevOps

### 2.1 Create Service Connection
1. Go to Azure DevOps → Project Settings → Service connections
2. Click "New service connection"
3. Select "Azure Resource Manager"
4. Choose "Service principal (automatic)"
5. Select your subscription and resource group
6. Name it: `azure-pulsesync-connection`

### 2.2 Update Pipeline Variables
Edit `azure-pipelines.yml` and update these variables:
```yaml
variables:
  azureSubscription: 'azure-pulsesync-connection'
  appServiceName: 'your-app-service-name'
  resourceGroupName: 'pulsesync-rg'
```

## Step 3: Configure Environment Variables

### 3.1 Set App Service Environment Variables
Go to Azure Portal → App Service → Configuration → Application settings:

```
NODE_ENV=production
WEBSITE_NODE_DEFAULT_VERSION=18.17.0
SCM_DO_BUILD_DURING_DEPLOYMENT=false
ENABLE_ORYX_BUILD=false
NEXTAUTH_URL=https://your-app-name.azurewebsites.net
NEXTAUTH_SECRET=your-secret-here
```

### 3.2 Add Your Application-Specific Variables
Based on your application needs, add:
- Database connection strings
- API keys (OpenAI, Spotify, etc.)
- Supabase configuration
- Redis configuration
- Azure AD configuration

## Step 4: Set Up Pipeline

### 4.1 Create Pipeline in Azure DevOps
1. Go to Azure DevOps → Pipelines
2. Click "New pipeline"
3. Select "Azure Repos Git"
4. Select your repository
5. Choose "Existing Azure Pipelines YAML file"
6. Select `/azure-pipelines.yml`
7. Click "Run"

### 4.2 Pipeline Features
The pipeline includes:
- **Build Stage**: 
  - Node.js setup
  - Dependency installation with caching
  - Linting
  - Application build
  - Artifact creation

- **Deploy Stage**:
  - Deploys only from `main` branch
  - Azure App Service deployment
  - Environment configuration

## Step 5: Monitoring and Troubleshooting

### 5.1 Application Insights (Optional)
```bash
az monitor app-insights component create \
  --app pulsesync-insights \
  --location "East US" \
  --resource-group pulsesync-rg
```

### 5.2 Common Issues and Solutions

**Issue**: Build fails with memory errors
**Solution**: Increase App Service plan to higher tier

**Issue**: Environment variables not loaded
**Solution**: Check App Service Configuration settings

**Issue**: Application won't start
**Solution**: Check logs in App Service → Log stream

### 5.3 Monitoring Commands
```bash
# Check deployment status
az webapp deployment list --name pulsesync-app --resource-group pulsesync-rg

# View application logs
az webapp log tail --name pulsesync-app --resource-group pulsesync-rg

# Restart application
az webapp restart --name pulsesync-app --resource-group pulsesync-rg
```

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain
```bash
az webapp config hostname add \
  --webapp-name pulsesync-app \
  --resource-group pulsesync-rg \
  --hostname yourdomain.com
```

### 6.2 SSL Certificate
```bash
az webapp config ssl create \
  --name pulsesync-app \
  --resource-group pulsesync-rg \
  --hostname yourdomain.com
```

## Security Considerations

1. **Environment Variables**: Never commit secrets to repository
2. **Service Principal**: Use least privilege access
3. **SSL/TLS**: Always use HTTPS in production
4. **Key Vault**: Consider Azure Key Vault for secrets management

## Cost Optimization

1. **App Service Plan**: Choose appropriate tier for your needs
2. **Auto-scaling**: Configure based on traffic patterns
3. **Resource monitoring**: Use Azure Monitor for insights

## Support

For issues specific to:
- Azure App Service: Check Azure documentation
- Next.js deployment: Check Next.js deployment guides
- Pipeline issues: Check Azure DevOps logs

---

## Quick Start Commands

After setting up the above, you can deploy by simply:
1. Pushing code to the `main` branch
2. Pipeline will automatically build and deploy
3. Access your app at: `https://your-app-name.azurewebsites.net`
