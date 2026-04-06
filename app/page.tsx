"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Monitor,
  Settings,
  Sparkles,
  Sun,
} from "lucide-react";

const formSchema = z.object({
  edad: z.string().min(1, "Selecciona un rango de edad."),
  digital: z.string().min(1, "Indica tu uso de dispositivos digitales."),
  conduccion: z.string().min(1, "Indica tu hábito de conducción."),
  exteriores: z.string().min(1, "Selecciona cómo es tu vida en exteriores."),
  od: z.string().min(1, "Completa la graduación OD."),
  adicion: z.number().min(0, "La adición debe ser 0 o superior."),
  potenciaTotal: z.number("Introduce una potencia válida."),
});

type FormData = z.infer<typeof formSchema>;
type FieldName = keyof FormData;
type StepStage = "Cliente" | "Óptico";

type OptionItem = {
  id: string;
  label: string;
  description: string;
  icon: ReactNode;
};

type StepDefinition = {
  field: FieldName;
  stage: StepStage;
  eyebrow: string;
  title: string;
  description: string;
  label: string;
  kind: "options" | "text" | "number";
  placeholder?: string;
  helper?: string;
  options?: OptionItem[];
};

const defaultValues: Partial<FormData> = {
  edad: "",
  digital: "",
  conduccion: "",
  exteriores: "",
  od: "",
};

const fieldLabels: Record<FieldName, string> = {
  edad: "Edad",
  digital: "Uso digital",
  conduccion: "Conducción",
  exteriores: "Vida exterior",
  od: "Graduación OD",
  adicion: "Adición",
  potenciaTotal: "Potencia total",
};

const selectionLabels: Partial<Record<FieldName, Record<string, string>>> = {
  edad: {
    menos40: "Menos de 40 años",
    "40-50": "40 a 50 años",
    mas50: "Más de 50 años",
  },
  digital: {
    ocasional: "Ocasional",
    moderado: "Moderado (3-6h)",
    intensivo: "Intensivo (+6h)",
  },
  conduccion: {
    ocasional: "No conduzco apenas",
    dia: "Sobre todo de día",
    noche: "Conducción nocturna",
  },
  exteriores: {
    interior: "Espacios interiores",
    mixto: "Entro y salgo con frecuencia",
    aireLibre: "Aire libre / Fotosensibilidad",
  },
};

const stepDefinitions: StepDefinition[] = [
  {
    field: "edad",
    stage: "Cliente",
    eyebrow: "Conocer al cliente",
    title: "¿Qué rango de edad tienes?",
    description:
      "Nos ayuda a ajustar la recomendación según tus necesidades visuales y tu momento vital.",
    label: "Rango de edad",
    kind: "options",
    options: [
      {
        id: "menos40",
        label: "Menos de 40 años",
        description:
          "Priorizamos relajación visual y comodidad en visión cercana.",
        icon: <Sparkles className="h-5 w-5" />,
      },
      {
        id: "40-50",
        label: "40 a 50 años",
        description:
          "Valoramos equilibrio entre lejos, cerca y transición durante el día.",
        icon: <Eye className="h-5 w-5" />,
      },
      {
        id: "mas50",
        label: "Más de 50 años",
        description:
          "Damos más peso a confort continuo y precisión en todas las distancias.",
        icon: <CheckCircle2 className="h-5 w-5" />,
      },
    ],
  },
  {
    field: "digital",
    stage: "Cliente",
    eyebrow: "Hábitos diarios",
    title: "¿Cuánto usas dispositivos digitales?",
    description: "Pantallas, móvil, ordenador o tablet a lo largo del día.",
    label: "Uso de dispositivos",
    kind: "options",
    options: [
      {
        id: "ocasional",
        label: "Ocasional",
        description: "Uso puntual, sin jornadas prolongadas frente a pantalla.",
        icon: <Monitor className="h-5 w-5" />,
      },
      {
        id: "moderado",
        label: "Moderado (3-6h)",
        description:
          "Hay carga visual diaria y conviene cuidar más el confort.",
        icon: <Monitor className="h-5 w-5" />,
      },
      {
        id: "intensivo",
        label: "Intensivo (+6h)",
        description:
          "El rendimiento y el descanso visual pasan a ser prioritarios.",
        icon: <Monitor className="h-5 w-5" />,
      },
    ],
  },
  {
    field: "conduccion",
    stage: "Cliente",
    eyebrow: "Situaciones de uso",
    title: "¿Cómo es tu conducción habitual?",
    description:
      "Queremos saber si hay conducción exigente, especialmente nocturna.",
    label: "Conducción habitual",
    kind: "options",
    options: [
      {
        id: "ocasional",
        label: "No conduzco apenas",
        description:
          "No es una necesidad principal dentro de la recomendación.",
        icon: <Settings className="h-5 w-5" />,
      },
      {
        id: "dia",
        label: "Sobre todo de día",
        description:
          "Buscamos claridad y estabilidad para desplazamientos habituales.",
        icon: <Car className="h-5 w-5" />,
      },
      {
        id: "noche",
        label: "Conducción nocturna",
        description:
          "Necesitamos afinar reflejos, contraste y deslumbramientos.",
        icon: <Car className="h-5 w-5" />,
      },
    ],
  },
  {
    field: "exteriores",
    stage: "Cliente",
    eyebrow: "Entorno visual",
    title: "¿Cómo es tu vida en exteriores?",
    description:
      "Valoramos tu exposición solar y la frecuencia con la que cambias de ambiente.",
    label: "Vida en exteriores",
    kind: "options",
    options: [
      {
        id: "interior",
        label: "Principalmente en interiores",
        description:
          "La recomendación se centra más en oficina, casa o espacios cerrados.",
        icon: <Monitor className="h-5 w-5" />,
      },
      {
        id: "mixto",
        label: "Entro y salgo con frecuencia",
        description:
          "Necesitamos una solución flexible para cambios de luz continuos.",
        icon: <Settings className="h-5 w-5" />,
      },
      {
        id: "aireLibre",
        label: "Mucho aire libre o fotosensibilidad",
        description:
          "La protección frente al sol y la adaptabilidad ganan importancia.",
        icon: <Sun className="h-5 w-5" />,
      },
    ],
  },
  {
    field: "od",
    stage: "Óptico",
    eyebrow: "Carga técnica",
    title: "¿Cuál es la graduación OD?",
    description: "Introduce la graduación en el formato habitual de la óptica.",
    label: "Graduación OD",
    kind: "text",
    placeholder: "Ej: -2.50",
    helper: "Dato introducido por el equipo técnico.",
  },
  {
    field: "adicion",
    stage: "Óptico",
    eyebrow: "Carga técnica",
    title: "¿Cuál es la adición?",
    description: "Usa incrementos de 0.25 para respetar la graduación real.",
    label: "Adición (+)",
    kind: "number",
    placeholder: "0.00",
    helper: "Este campo lo completa la óptica.",
  },
  {
    field: "potenciaTotal",
    stage: "Óptico",
    eyebrow: "Carga técnica",
    title: "¿Cuál es la potencia total?",
    description: "Es un dato clave para afinar el material recomendado.",
    label: "Potencia total (Esf + Cyl)",
    kind: "number",
    placeholder: "Ej: -3.25",
    helper: "Se usa para definir espesor y ligereza del lente.",
  },
];

const questionFields = stepDefinitions.map((step) => step.field);
const totalSteps = stepDefinitions.length + 1;

const parseOptionalNumber = (value: string) => {
  if (value === "") return Number.NaN;
  return Number(value);
};

export default function CuestionarioOptica() {
  const [step, setStep] = useState(0);

  const {
    control,
    register,
    trigger,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onTouched",
  });

  const data = useWatch({ control });
  const isResultStep = step === stepDefinitions.length;
  const currentStep = stepDefinitions[step];
  const progress = (
    (Math.min(step + 1, totalSteps) / totalSteps) *
    100
  ).toFixed(0);

  const getRecomendacion = () => {
    const potenciaTotal = data.potenciaTotal ?? 0;
    const adicion = data.adicion ?? 0;

    let material = "Índice 1.50 (Estándar)";
    if (Math.abs(potenciaTotal) > 4.25)
      material = "Índice 1.67/1.74 (Ultra fino)";
    else if (Math.abs(potenciaTotal) >= 2.25)
      material = "Índice 1.60 / Airwear (20% más fino)";

    let diseno = "Varilux Comfort Max";
    if (data.edad === "menos40" || data.digital === "intensivo")
      diseno = "Eyezen (Relajación visual)";
    if (adicion > 1.5) diseno = "Varilux XR series (IA conductual)";
    if (data.digital === "intensivo" && adicion > 0)
      diseno = "Varilux Digitime (Ocupacional)";

    let tratamiento = "Crizal Sapphire HR";
    if (data.conduccion === "noche")
      tratamiento = "Crizal Drive (Antirreflejante para conducción)";
    if (data.exteriores === "aireLibre")
      tratamiento = "Transitions Gen S (Lentes inteligentes)";

    return { material, diseno, tratamiento };
  };

  const recomendacion = getRecomendacion();

  const getFormattedValue = (field: FieldName) => {
    const rawValue = data[field];

    if (rawValue === undefined || rawValue === "") return "Pendiente";
    if (typeof rawValue === "number")
      return Number.isNaN(rawValue) ? "Pendiente" : rawValue.toFixed(2);

    const mappedValue = selectionLabels[field]?.[rawValue];
    return mappedValue ?? String(rawValue);
  };

  const handleNextStep = async () => {
    if (isResultStep) return;

    const isValid = await trigger(currentStep.field, { shouldFocus: true });
    if (!isValid) return;

    setStep((currentValue) =>
      Math.min(currentValue + 1, stepDefinitions.length),
    );
  };

  const handlePreviousStep = () => {
    setStep((currentValue) => Math.max(currentValue - 1, 0));
  };

  const handleRestart = () => {
    reset(defaultValues);
    setStep(0);
  };

  const stageCards = [
    {
      title: "Conversación con cliente",
      description:
        "4 preguntas para detectar hábitos, entorno y necesidades de uso.",
      state: step >= 4 ? "done" : step < 4 ? "active" : "idle",
    },
    {
      title: "Carga técnica",
      description:
        "3 datos que introduce el óptico para cerrar la recomendación.",
      state: isResultStep ? "done" : step >= 4 ? "active" : "idle",
    },
    {
      title: "Recomendación final",
      description:
        "Resumen visual de diseño, material y tratamiento sugeridos.",
      state: isResultStep ? "active" : "idle",
    },
  ] as const;

  const renderChoiceStep = (stepDefinition: StepDefinition) => {
    return (
      <div className="grid gap-3">
        {stepDefinition.options?.map((option) => {
          const isSelected = data[stepDefinition.field] === option.id;

          return (
            <label
              key={option.id}
              className={`group flex cursor-pointer items-start gap-4 rounded-[28px] border px-5 py-4 transition-all duration-200 ${
                isSelected
                  ? "border-[#1c5c5f] bg-[#1c5c5f] text-white shadow-[0_20px_40px_rgba(28,92,95,0.18)]"
                  : "border-[#ded4c6] bg-[rgba(255,255,255,0.88)] text-[#21353a] hover:border-[#c5b7a3] hover:bg-white"
              }`}
            >
              <input
                type="radio"
                value={option.id}
                className="sr-only"
                {...register(stepDefinition.field)}
              />
              <div
                className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                  isSelected
                    ? "border-white/20 bg-white/10"
                    : "border-[#e8dfd1] bg-[#f7f1e7] text-[#8d6b33]"
                }`}
              >
                {option.icon}
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold">{option.label}</p>
                <p
                  className={`text-sm leading-6 ${isSelected ? "text-white/80" : "text-[#5d6f74]"}`}
                >
                  {option.description}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    );
  };

  const renderInputStep = (stepDefinition: StepDefinition) => {
    const inputClassName =
      "w-full rounded-[26px] border border-[#d8cdbd] bg-white px-5 py-4 text-lg text-[#16343b] outline-none transition placeholder:text-[#9f9484] focus:border-[#1c5c5f] focus:ring-4 focus:ring-[#1c5c5f]/10";

    if (stepDefinition.kind === "text") {
      return (
        <div className="space-y-4">
          <label className="block text-sm font-semibold uppercase tracking-[0.24em] text-[#7d6d58]">
            {stepDefinition.label}
          </label>
          <input
            type="text"
            placeholder={stepDefinition.placeholder}
            className={inputClassName}
            {...register(stepDefinition.field)}
          />
          {stepDefinition.helper && (
            <p className="text-sm text-[#6c7670]">{stepDefinition.helper}</p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <label className="block text-sm font-semibold uppercase tracking-[0.24em] text-[#7d6d58]">
          {stepDefinition.label}
        </label>
        <input
          type="number"
          step="0.25"
          placeholder={stepDefinition.placeholder}
          className={inputClassName}
          {...register(stepDefinition.field, {
            setValueAs: parseOptionalNumber,
          })}
        />
        {stepDefinition.helper && (
          <p className="text-sm text-[#6c7670]">{stepDefinition.helper}</p>
        )}
      </div>
    );
  };

  const renderQuestionStep = () => {
    if (!currentStep) return null;

    const errorMessage = errors[currentStep.field]?.message;

    return (
      <div className="space-y-8">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#d8cab4] bg-[#f3eadb] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#8d6b33]">
              {currentStep.stage}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d6d58]">
              {currentStep.eyebrow}
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7d6d58]">
              Pregunta {step + 1}
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl leading-tight text-[#16343b] md:text-5xl">
              {currentStep.title}
            </h2>
            <p className="max-w-2xl text-base leading-7 text-[#586a6f]">
              {currentStep.description}
            </p>
          </div>
        </div>

        {currentStep.kind === "options"
          ? renderChoiceStep(currentStep)
          : renderInputStep(currentStep)}

        {errorMessage && (
          <div className="rounded-2xl border border-[#e8b5a7] bg-[#fff1ed] px-4 py-3 text-sm text-[#a34f3d]">
            {errorMessage}
          </div>
        )}
      </div>
    );
  };

  const renderResultStep = () => {
    return (
      <div className="space-y-8">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#d8cab4] bg-[#f3eadb] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#8d6b33]">
              Recomendación lista
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7d6d58]">
              Resultado final
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-4xl leading-tight text-[#16343b] md:text-5xl">
              Propuesta visual para presentar al cliente
            </h2>
            <p className="max-w-2xl text-base leading-7 text-[#586a6f]">
              La recomendación combina hábitos, exposición diaria y datos
              técnicos para ofrecer una solución clara y fácil de argumentar en
              tienda.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Diseño sugerido",
              value: recomendacion.diseno,
              tone: "bg-[#16343b] text-white border-[#16343b]",
            },
            {
              title: "Material recomendado",
              value: recomendacion.material,
              tone: "bg-[#f7f1e7] text-[#16343b] border-[#d7c9b6]",
            },
            {
              title: "Tratamiento ideal",
              value: recomendacion.tratamiento,
              tone: "bg-white text-[#16343b] border-[#ddd2c3]",
            },
          ].map((card) => (
            <div
              key={card.title}
              className={`rounded-[30px] border px-5 py-6 shadow-[0_18px_40px_rgba(28,33,44,0.06)] ${card.tone}`}
            >
              <p className="text-sm uppercase tracking-[0.24em] opacity-70">
                {card.title}
              </p>
              <p className="mt-4 text-xl font-semibold leading-8">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-[30px] border border-[#d9cdbd] bg-[#f7f1e7] px-6 py-5 text-[#3c4f54]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8d6b33]">
            Presentación sugerida
          </p>
          <p className="mt-3 text-base leading-7">
            Esta combinación prioriza confort, estética y rendimiento visual
            según el estilo de vida del cliente y la graduación introducida por
            la óptica.
          </p>
        </div>
      </div>
    );
  };

  return (
    <main className="w-full px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[390px,minmax(0,1fr)]">
        <aside className="relative overflow-hidden rounded-[34px] border border-[#2c555b] bg-[#16343b] text-[#f8f4ed] shadow-[0_40px_100px_rgba(18,29,31,0.35)]">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_60%)]" />
          <div className="relative space-y-8 p-6 md:p-8">
            <div className="space-y-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.3em] text-[#d3c6b5]">
                  Optica Costa Blanca
                </p>
                <h1 className="font-[family-name:var(--font-display)] text-3xl text-white">
                  Asesor visual premium
                </h1>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#d3c6b5]">
                    Progreso
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {Math.min(step + 1, totalSteps)} / {totalSteps}
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-[#e9decf]">
                  {progress}%
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#e0b872] via-[#f0d8aa] to-[#fff3db]"
                />
              </div>
            </div>

            <div className="space-y-3">
              {stageCards.map((stageCard) => {
                const isActive = stageCard.state === "active";
                const isDone = stageCard.state === "done";

                return (
                  <div
                    key={stageCard.title}
                    className={`rounded-[26px] border px-4 py-4 transition ${
                      isActive
                        ? "border-[#e2bc79] bg-[#21454b] shadow-[0_20px_30px_rgba(0,0,0,0.12)]"
                        : isDone
                          ? "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.08)]"
                          : "border-[rgba(255,255,255,0.08)] bg-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isDone
                            ? "bg-[#e2bc79] text-[#16343b]"
                            : isActive
                              ? "bg-white text-[#16343b]"
                              : "bg-white/10 text-white/80"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-bold">•</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {stageCard.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[#cfd9d7]">
                          {stageCard.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[#10292d] p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-[#d3c6b5]">
                Ficha en curso
              </p>
              <div className="mt-4 grid gap-3">
                {questionFields.map((field) => (
                  <div
                    key={field}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3"
                  >
                    <span className="text-sm text-[#d9e2e0]">
                      {fieldLabels[field]}
                    </span>
                    <span className="max-w-[55%] truncate text-sm font-semibold text-white">
                      {getFormattedValue(field)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="relative overflow-hidden rounded-[34px] border border-[#ddd0bd] bg-[rgba(251,248,242,0.9)] shadow-[0_40px_100px_rgba(112,95,71,0.15)] backdrop-blur">
          <div className="absolute right-0 top-0 h-64 w-64 bg-[radial-gradient(circle,_rgba(28,92,95,0.15),_transparent_65%)]" />
          <div className="absolute bottom-0 left-0 h-64 w-64 bg-[radial-gradient(circle,_rgba(226,188,121,0.22),_transparent_60%)]" />

          <div className="relative flex min-h-full flex-col p-6 md:p-8 lg:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.22 }}
                className="flex-1"
              >
                {isResultStep ? renderResultStep() : renderQuestionStep()}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex flex-col gap-3 border-t border-[#e5dacb] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-[#68777b]">
                {isResultStep
                  ? "La propuesta ya está lista para compartir con el cliente."
                  : currentStep.stage === "Cliente"
                    ? "Paso guiado para conversación en tienda."
                    : "Paso reservado para carga técnica del óptico."}
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                {step > 0 && (
                  <button
                    onClick={handlePreviousStep}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d2c6b6] px-5 py-3 text-sm font-semibold text-[#264247] transition hover:border-[#b9ab99] hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" /> Atrás
                  </button>
                )}

                {isResultStep ? (
                  <button
                    onClick={handleRestart}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16343b] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(22,52,59,0.22)] transition hover:bg-[#1c4048]"
                  >
                    Empezar de nuevo
                  </button>
                ) : (
                  <button
                    onClick={handleNextStep}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8d6b33] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(141,107,51,0.24)] transition hover:bg-[#7d5f2d]"
                  >
                    Continuar <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
