{{/*
Expand the name of the chart.
*/}}
{{- define "service.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "service.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "service.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "service.labels" -}}
app: {{ template "service.name" . }}
version: v1
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "service.annotations" -}}
meta.helm.sh/release-name: {{ .Chart.Name }}
{{- end }}

{{- define "service.vault.annotations" -}}
vault.hashicorp.com/agent-inject: 'true'
vault.hashicorp.com/agent-inject-status: "update"
vault.hashicorp.com/role: 'vault-auth'
vault.hashicorp.com/agent-inject-secret-config: "kv/data/{{ template "service.fullname" . }}"
vault.hashicorp.com/agent-inject-template-config: |
    {{printf "{{- with secret "}} "kv/data/{{ template "service.fullname" . }}" {{ ` -}} 
    #!/bin/sh
    set -e
    echo "Get Secret From Vault Hashicorp"
    {{ range $k, $v := .Data.data }}
    echo {{ $k }}
    export {{ $k }}={{ $v }}
    {{ end }}
    {{- end }} `}}
{{- end }}

