# Auto Kilometerstand Tracker

Eine Progressive Web App (PWA) zum Tracking des Kilometerstands eines Autos mit 40.000 km Limit über 4 Jahre.

## Features

- PWA mit Offline-Support
- Berechnung verfügbarer Kilometer basierend auf Vertragsstart (07.10.2025)
- Responsive Design für Mobile und Desktop
- Service Worker für Caching
- Kubernetes-Deployment via GitOps (ArgoCD)

## Deployment

Die Anwendung wird automatisch via GitOps deployed:

1. **Docker Image**: Bei jedem Push auf `master`/`main` wird automatisch ein Docker Image gebaut und zu ghcr.io gepusht
2. **Helm Chart**: Der Helm Chart wird ebenfalls automatisch gebaut und zu ghcr.io gepusht
3. **ArgoCD**: ArgoCD synchronisiert automatisch die neueste Version des Helm Charts

### Domain

Die Anwendung ist erreichbar unter: **https://auto.apollo.srv64.de**

DNS-Eintrag:
- Domain: `auto.apollo.srv64.de`
- IP: `91.99.176.170`

### TLS-Zertifikat

Das TLS-Zertifikat wird automatisch via cert-manager mit Let's Encrypt erstellt:
- Issuer: `letsencrypt-prod`
- Secret: `auto-tls-cert`

## Lokale Entwicklung

### Docker lokal bauen und testen

```bash
# Image bauen
docker build -t auto:local .

# Container starten
docker run -p 8080:80 auto:local

# Im Browser öffnen
open http://localhost:8080
```

### Helm Chart lokal testen

```bash
# Chart linten
helm lint chart/auto

# Chart installieren (lokal)
helm install auto chart/auto --namespace auto --create-namespace

# Chart deinstallieren
helm uninstall auto --namespace auto
```

## Projektstruktur

```
.
├── index.html              # Haupt-HTML-Datei
├── manifest.json           # PWA Manifest
├── service-worker.js       # Service Worker für Offline-Support
├── icon-*.png             # PWA Icons
├── Dockerfile             # Docker Image Definition
├── nginx.conf             # Nginx Konfiguration
├── .dockerignore          # Docker ignore patterns
├── .github/
│   └── workflows/
│       └── release.yaml   # GitHub Actions Workflow
└── chart/
    └── auto/              # Helm Chart
        ├── Chart.yaml
        ├── values.yaml
        └── templates/
            ├── deployment.yaml
            ├── service.yaml
            ├── ingress.yaml
            └── ...
```

## CI/CD Pipeline

Die CI/CD Pipeline läuft automatisch bei jedem Push auf `master`/`main`:

1. Versionierung (automatischer Patch-Bump)
2. Docker Image Build & Push zu `ghcr.io/hawk-softworks/auto:VERSION`
3. Helm Chart Package & Push zu `ghcr.io/hawk-softworks/auto:VERSION`
4. Git Tag & GitHub Release erstellen
5. ArgoCD erkennt neue Version und deployed automatisch

## Manual Deployment

Falls du manuell deployen möchtest:

```bash
# Helm Chart von GHCR installieren
helm registry login ghcr.io -u <github-username>
helm install auto oci://ghcr.io/hawk-softworks/auto --version 1.0.0 --namespace auto --create-namespace

# Oder via kubectl + ArgoCD
kubectl apply -f kubernetes/argocd-apps/external-apps/auto.yaml
```

## Maintenance

### Update der Anwendung

1. Änderungen in `index.html`, `manifest.json`, etc. machen
2. Commit & Push zu GitHub
3. GitHub Actions baut automatisch neue Version
4. ArgoCD deployed automatisch nach ~3 Minuten

### Monitoring

```bash
# Pod Status checken
kubectl get pods -n auto

# Logs ansehen
kubectl logs -n auto -l app.kubernetes.io/name=auto -f

# Ingress Status
kubectl get ingress -n auto

# Certificate Status
kubectl get certificate -n auto
```

## Troubleshooting

### Certificate nicht erstellt

```bash
# Certificate Status
kubectl describe certificate auto-tls-cert -n auto

# cert-manager Logs
kubectl logs -n cert-manager -l app=cert-manager -f

# Challenge Status
kubectl get challenges -n auto
```

### Pod startet nicht

```bash
# Pod Events
kubectl describe pod -n auto -l app.kubernetes.io/name=auto

# Pod Logs
kubectl logs -n auto -l app.kubernetes.io/name=auto
```

### ArgoCD Sync Fehler

```bash
# ArgoCD App Status
kubectl get application auto -n argocd -o yaml

# ArgoCD Logs
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-application-controller
```
