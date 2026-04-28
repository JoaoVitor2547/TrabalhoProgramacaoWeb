import type { EnderecoViaCep } from "@/types";
import { onlyDigits } from "./utils";

export type ViaCepResult =
  | { ok: true; data: EnderecoViaCep }
  | { ok: false; reason: "invalid" | "notfound" | "network" | "timeout" };

const VIACEP_BASE = "https://viacep.com.br/ws";
const TIMEOUT_MS = 5000;

export async function fetchCep(rawCep: string): Promise<ViaCepResult> {
  const cep = onlyDigits(rawCep);
  if (cep.length !== 8) {
    return { ok: false, reason: "invalid" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${VIACEP_BASE}/${cep}/json/`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: "force-cache",
    });

    if (!response.ok) {
      return { ok: false, reason: "network" };
    }

    const payload = (await response.json()) as Partial<EnderecoViaCep> & {
      erro?: boolean;
    };

    if (payload.erro) {
      return { ok: false, reason: "notfound" };
    }

    return {
      ok: true,
      data: {
        cep: payload.cep ?? cep,
        logradouro: payload.logradouro ?? "",
        bairro: payload.bairro ?? "",
        localidade: payload.localidade ?? "",
        uf: payload.uf ?? "",
      },
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { ok: false, reason: "timeout" };
    }
    return { ok: false, reason: "network" };
  } finally {
    clearTimeout(timeout);
  }
}
