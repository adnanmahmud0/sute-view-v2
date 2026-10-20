#!/usr/bin/env pwsh
<#
.SYNOPSIS
Interactive Project Creator for Fullstack Turborepo Starter Kit
.DESCRIPTION
Spawns a new independent repository from any template branch variant.
#>

param(
    [string]$Name,
    [string]$Branch,
    [string]$Remote
)

$argsList = @("scripts/create-project.mjs")
if ($Name) { $argsList += $Name }
if ($Branch) { $argsList += "--branch"; $argsList += $Branch }
if ($Remote) { $argsList += "--remote"; $argsList += $Remote }

node @argsList
