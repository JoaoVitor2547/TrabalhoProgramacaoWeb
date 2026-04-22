"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TermosDialogProps {
  trigger: React.ReactNode;
}

export function TermosDialog({ trigger }: TermosDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Termos e condições</DialogTitle>
          <DialogDescription>
            Leia atentamente antes de aceitar.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm leading-relaxed text-ink-700">
          <p>
            A Vital Ativa respeita sua privacidade e trata seus dados apenas
            para fins cadastrais, operacionais e de comunicação relacionados à
            prestação de serviços de academia.
          </p>
          <p>
            <strong className="font-semibold text-ink-900">
              Uso dos dados.
            </strong>{" "}
            Suas informações serão utilizadas para emissão de contrato,
            avaliação física, agendamento de aulas e comunicações sobre sua
            matrícula. Não compartilhamos dados com terceiros sem autorização
            expressa.
          </p>
          <p>
            <strong className="font-semibold text-ink-900">
              Contrato e cancelamento.
            </strong>{" "}
            A matrícula é mensal, com vigência conforme o plano escolhido.
            Cancelamentos devem ser solicitados com 30 dias de antecedência,
            conforme regras contratuais.
          </p>
          <p>
            <strong className="font-semibold text-ink-900">
              Responsabilidade.
            </strong>{" "}
            O aluno declara estar apto à prática de atividades físicas e se
            compromete a informar eventuais condições de saúde à equipe
            técnica.
          </p>
          <p>
            <strong className="font-semibold text-ink-900">LGPD.</strong> Você
            pode solicitar acesso, correção ou exclusão dos seus dados pelo
            e-mail{" "}
            <a
              href="mailto:contato@vitalativa.com.br"
              className="text-brand-700 underline"
            >
              contato@vitalativa.com.br
            </a>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
