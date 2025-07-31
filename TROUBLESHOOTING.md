# 🔧 UpTax Flow - Troubleshooting Guide

## 📋 Problemas Comuns e Soluções

### 🚨 Problema: pnpm-lock.yaml Desatualizado (RESOLVIDO - 31/01/2025)

**Erro:**
```
ERR_PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json
```

**Causa Raiz:**
- Desalinhamento entre `package.json` e `pnpm-lock.yaml`
- Versões fixas no lockfile diferentes dos ranges no package.json
- Dependências dev/prod mal categorizadas

**Discrepâncias Identificadas:**
- `@unocss/reset`: package.json `^0.61.0` vs lockfile `0.61.3`
- `react/react-dom`: package.json `^18.2.0` vs lockfile `18.3.1`
- `isbot`: package.json `^4.1.0` vs lockfile `4.4.0`

**Solução Aplicada:**
```bash
cd uptax-flow
pnpm install --no-frozen-lockfile
```

**Prevenção:**
- **Desenvolvimento:** Use `pnpm install --no-frozen-lockfile`
- **CI/CD:** Use `pnpm install --frozen-lockfile` 
- **Commits:** Sempre commitar lockfile atualizado

---

## 🔧 Comandos de Diagnóstico

### Verificar Status das Dependências
```bash
# Verificar lockfile
pnpm list --depth=0

# Verificar dependências outdated
pnpm outdated

# Verificar integridade
pnpm audit
```

### Limpeza Completa
```bash
# Limpar cache e node_modules
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 📊 Histórico de Problemas Resolvidos

| Data | Problema | Status | Solução |
|------|----------|--------|---------|
| 31/01/2025 | pnpm-lock.yaml desatualizado | ✅ Resolvido | `pnpm install --no-frozen-lockfile` |
| | Dependências deprecated | ⚠️ Menor | 2 deps: rollup-plugin-inject, sourcemap-codec |

---

## 🎯 Próximas Ações Preventivas

1. **Setup Pre-commit Hooks** - Validar lockfile antes de commits
2. **CI/CD Enhancement** - Adicionar step de verificação de dependências
3. **Documentação** - Manter este guia atualizado

---

**Última Atualização:** 31/01/2025  
**Responsável:** UpTax DevOps Team