'use client';

import Image from 'next/image';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import {
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Monitor,
  RotateCcw,
  Settings,
  Sparkles,
  Sun,
} from 'lucide-react';

const formSchema = z.object({
  edad: z.string().min(1, 'Selecciona un rango de edad.'),
  digital: z.string().min(1, 'Indica tu uso de dispositivos digitales.'),
  conduccion: z.string().min(1, 'Indica tu hábito de conducción.'),
  exteriores: z.string().min(1, 'Selecciona cómo es tu vida en exteriores.'),
  od: z.string().min(1, 'Completa la graduación OD.'),
  adicion: z.number().min(0, 'La adición debe ser 0 o superior.'),
  potenciaTotal: z.number('Introduce una potencia válida.'),
});

type FormData = z.infer<typeof formSchema>;
type FieldName = keyof FormData;

const defaultValues: Partial<FormData> = {
  edad: '',
  digital: '',
  conduccion: '',
  exteriores: '',
  od: '',
};

const questionSteps: FieldName[] = [
  'edad',
  'digital',
  'conduccion',
  'exteriores',
  'od',
  'adicion',
  'potenciaTotal',
];

const totalSteps = questionSteps.length + 1;

const parseOptionalNumber = (value: string) => {
  if (value === '') return Number.NaN;
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
    mode: 'onTouched',
  });

  const data = useWatch({ control });
  const isResultStep = step === questionSteps.length;
  const currentField = questionSteps[step];
  const progress = ((Math.min(step + 1, totalSteps) / totalSteps) * 100).toFixed(0);
  const isClientStep = step < 4;
  const stepGroupLabel = isResultStep
    ? 'Resultado'
    : isClientStep
      ? 'Preguntas al cliente'
      : 'Datos técnicos';

  const getRecomendacion = () => {
    const potenciaTotal = data.potenciaTotal ?? 0;
    const adicion = data.adicion ?? 0;

    let material = 'Índice 1.50 (Estándar)';
    if (Math.abs(potenciaTotal) > 4.25) material = 'Índice 1.67 / 1.74 (Ultra fino)';
    else if (Math.abs(potenciaTotal) >= 2.25) material = 'Índice 1.60 / Airwear (20% más fino)';

    let diseno = 'Varilux Comfort Max';
    if (data.edad === 'menos40' || data.digital === 'intensivo') diseno = 'Eyezen (Relajación visual)';
    if (adicion > 1.5) diseno = 'Varilux XR series (IA conductual)';
    if (data.digital === 'intensivo' && adicion > 0) diseno = 'Varilux Digitime (Ocupacional)';

    let tratamiento = 'Crizal Sapphire HR';
    if (data.conduccion === 'noche') tratamiento = 'Crizal Drive (Antirreflejante nocturno)';
    if (data.exteriores === 'aireLibre') tratamiento = 'Transitions Gen S (Lentes inteligentes)';

    return { material, diseno, tratamiento };
  };

  const recomendacion = getRecomendacion();

  const handleNextStep = async () => {
    if (isResultStep) return;
    const isValid = await trigger(currentField, { shouldFocus: true });
    if (!isValid) return;
    setStep((s) => Math.min(s + 1, questionSteps.length));
  };

  const handlePreviousStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleRestart = () => {
    reset(defaultValues);
    setStep(0);
  };

  const optionClass = (isSelected: boolean) =>
    `flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-left transition-all duration-150 ring-1 active:scale-[0.98] ${
      isSelected
        ? 'bg-[--color-accent] text-white ring-[--color-accent] shadow-lg'
        : 'bg-[--color-surface-raised] text-[--color-foreground] ring-[--color-border-strong] hover:ring-[--color-accent]/50'
    }`;

  const inputClass =
    'w-full bg-[--color-surface-raised] text-[--color-foreground] placeholder:text-[--color-muted] px-4 py-4 rounded-2xl outline-none ring-1 ring-[--color-border-strong] focus:ring-[--color-accent] transition text-base';

  const renderStep = () => {
    switch (currentField) {
      case 'edad':
        return (
          <StepWrapper label="Perfil del cliente" title="¿Qué rango de edad tienes?" description="Esto nos ayuda a perfilar el tipo de lente más adecuado.">
            <div className="grid gap-3">
              {[
                { id: 'menos40', label: 'Menos de 40 años' },
                { id: '40-50', label: '40 a 50 años' },
                { id: 'mas50', label: 'Más de 50 años' },
              ].map((item) => (
                <label key={item.id} className={optionClass(data.edad === item.id)}>
                  <input type="radio" value={item.id} className="sr-only" {...register('edad')} />
                  <span className="text-base font-medium">{item.label}</span>
                </label>
              ))}
            </div>
            {errors.edad && <ErrorMsg>{errors.edad.message}</ErrorMsg>}
          </StepWrapper>
        );

      case 'digital':
        return (
          <StepWrapper label="Uso digital" title="¿Cuánto usas dispositivos digitales?" description="Pantallas, móvil, ordenador o tablet a lo largo del día.">
            <div className="grid gap-3">
              {[
                { id: 'ocasional', label: 'Ocasional (menos de 3h)' },
                { id: 'moderado', label: 'Moderado (3–6h)' },
                { id: 'intensivo', label: 'Intensivo (más de 6h)' },
              ].map((item) => (
                <label key={item.id} className={optionClass(data.digital === item.id)}>
                  <input type="radio" value={item.id} className="sr-only" {...register('digital')} />
                  <span className="text-base font-medium">{item.label}</span>
                </label>
              ))}
            </div>
            {errors.digital && <ErrorMsg>{errors.digital.message}</ErrorMsg>}
          </StepWrapper>
        );

      case 'conduccion':
        return (
          <StepWrapper label="Conducción" title="¿Cómo es tu conducción habitual?" description="Nos interesa saber si conduces de noche o en condiciones exigentes.">
            <div className="grid gap-3">
              {[
                { id: 'ocasional', label: 'No conduzco apenas', icon: <Settings size={17} /> },
                { id: 'dia', label: 'Sobre todo de día', icon: <Car size={17} /> },
                { id: 'noche', label: 'Conducción nocturna frecuente', icon: <Car size={17} /> },
              ].map((item) => (
                <label key={item.id} className={optionClass(data.conduccion === item.id)}>
                  <input type="radio" value={item.id} className="sr-only" {...register('conduccion')} />
                  <span className="shrink-0 opacity-70">{item.icon}</span>
                  <span className="text-base font-medium">{item.label}</span>
                </label>
              ))}
            </div>
            {errors.conduccion && <ErrorMsg>{errors.conduccion.message}</ErrorMsg>}
          </StepWrapper>
        );

      case 'exteriores':
        return (
          <StepWrapper label="Vida exterior" title="¿Cómo es tu vida en exteriores?" description="Buscamos entender tu exposición al sol y los cambios de luz.">
            <div className="grid gap-3">
              {[
                { id: 'interior', label: 'Mayormente en interiores', icon: <Monitor size={17} /> },
                { id: 'mixto', label: 'Entra y sale con frecuencia', icon: <Settings size={17} /> },
                { id: 'aireLibre', label: 'Mucho tiempo al aire libre', icon: <Sun size={17} /> },
              ].map((item) => (
                <label key={item.id} className={optionClass(data.exteriores === item.id)}>
                  <input type="radio" value={item.id} className="sr-only" {...register('exteriores')} />
                  <span className="shrink-0 opacity-70">{item.icon}</span>
                  <span className="text-base font-medium">{item.label}</span>
                </label>
              ))}
            </div>
            {errors.exteriores && <ErrorMsg>{errors.exteriores.message}</ErrorMsg>}
          </StepWrapper>
        );

      case 'od':
        return (
          <StepWrapper label="Datos del óptico" title="Graduación OD" description="Introduce la graduación en el formato habitual (ej: -2.50).">
            <input type="text" placeholder="Ej: -2.50" className={inputClass} {...register('od')} />
            {errors.od && <ErrorMsg>{errors.od.message}</ErrorMsg>}
          </StepWrapper>
        );

      case 'adicion':
        return (
          <StepWrapper label="Datos del óptico" title="Adición" description="Usa pasos de 0.25 si lo necesitas.">
            <input
              type="number"
              step="0.25"
              placeholder="0.00"
              className={inputClass}
              {...register('adicion', { setValueAs: parseOptionalNumber })}
            />
            {errors.adicion && <ErrorMsg>{errors.adicion.message}</ErrorMsg>}
          </StepWrapper>
        );

      case 'potenciaTotal':
        return (
          <StepWrapper label="Datos del óptico" title="Potencia total" description="Suma de esfera y cilindro. Dato clave para el material del lente.">
            <input
              type="number"
              step="0.25"
              placeholder="Ej: -3.25"
              className={inputClass}
              {...register('potenciaTotal', { setValueAs: parseOptionalNumber })}
            />
            {errors.potenciaTotal && <ErrorMsg>{errors.potenciaTotal.message}</ErrorMsg>}
          </StepWrapper>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-dvh bg-[--color-background] text-[--color-foreground] flex flex-col">
      {/* Header con foto de la optica */}
      <header className="sticky top-0 z-50 bg-[--color-surface]/90 backdrop-blur-md border-b border-[--color-border]">
        <div className="flex items-center justify-between px-4 h-16 max-w-lg mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="relative rounded-xl overflow-hidden bg-white shadow-md shrink-0" style={{ width: 40, height: 40 }}>
              <Image
                src="/optica%20calpe.png"
                alt="Optica Costa Blanca"
                fill
                className="object-contain p-1"
                sizes="40px"
                priority
                loading="eager"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-[--color-foreground] leading-tight">Optica Costa Blanca</p>
              <p className="text-[11px] text-[--color-muted] leading-tight">Asesor de lentes</p>
            </div>
          </div>
          <div className="text-xs font-mono text-[--color-accent] tabular-nums">
            {Math.min(step + 1, totalSteps)}<span className="text-[--color-muted]">/{totalSteps}</span>
          </div>
        </div>
      </header>

      {/* Barra de progreso */}
      <div className="h-1 bg-[--color-surface-raised]">
        <div
          className="h-full bg-[--color-accent] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Etiqueta de fase */}
      <div className="px-4 pt-4 pb-1 max-w-lg mx-auto w-full">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-[--color-muted] border border-[--color-border-strong] rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[--color-accent] shrink-0" />
          {stepGroupLabel}
        </span>
      </div>

      {/* Contenido del step */}
      <main className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {isResultStep ? (
              <ResultView recomendacion={recomendacion} />
            ) : (
              renderStep()
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navegacion fija en el fondo */}
      <div className="sticky bottom-0 bg-[--color-surface]/95 backdrop-blur-md border-t border-[--color-border] px-4 py-3 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between gap-3">
          {step > 0 ? (
            <button
              onClick={handlePreviousStep}
              className="flex items-center gap-2 px-4 py-3 text-[--color-muted] hover:text-[--color-foreground] transition text-sm font-medium"
            >
              <ChevronLeft size={18} />
              Atrás
            </button>
          ) : (
            <div />
          )}

          {isResultStep ? (
            <button
              onClick={handleRestart}
              className="ml-auto flex items-center gap-2 px-6 py-3 bg-[--color-surface-raised] text-[--color-foreground] rounded-2xl font-semibold text-sm hover:bg-[--color-border-strong] transition active:scale-[0.97] ring-1 ring-[--color-border-strong]"
            >
              <RotateCcw size={16} />
              Nuevo cuestionario
            </button>
          ) : (
            <button
              onClick={handleNextStep}
              className="ml-auto flex items-center gap-2 px-6 py-3 bg-[--color-accent] text-white rounded-2xl font-semibold text-sm hover:bg-[--color-accent-hover] transition active:scale-[0.97] shadow-lg shadow-blue-900/30"
            >
              Continuar
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-componentes

function StepWrapper({
  label,
  title,
  description,
  children,
}: {
  label: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5 pt-2 pb-6">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-[--color-accent]">{label}</p>
        <h2 className="text-2xl font-bold text-balance leading-snug">{title}</h2>
        <p className="text-sm text-[--color-muted] leading-relaxed">{description}</p>
      </div>
      {children}
    </div>
  );
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-red-400 mt-1">{children}</p>;
}

function ResultView({
  recomendacion,
}: {
  recomendacion: { material: string; diseno: string; tratamiento: string };
}) {
  return (
    <div className="pt-2 pb-6 space-y-6">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-[--color-accent]">Recomendacion</p>
        <h2 className="text-2xl font-bold">Solución óptima sugerida</h2>
        <p className="text-sm text-[--color-muted] leading-relaxed">
          Combinacion personalizada basada en el perfil visual del cliente.
        </p>
      </div>

      {/* Tarjeta principal de diseño */}
      <div className="rounded-3xl bg-[--color-accent-subtle] border border-[--color-accent]/30 p-5 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-[--color-accent] mb-3">Diseño de lente</p>
        <div className="flex items-center gap-3">
          <Sparkles className="text-[--color-accent] shrink-0" size={22} />
          <p className="text-xl font-bold text-[--color-foreground]">{recomendacion.diseno}</p>
        </div>
      </div>

      {/* Detalles adicionales */}
      <div className="space-y-3">
        <ResultItem icon={<CheckCircle2 size={18} className="text-[--color-success]" />} label="Material" value={recomendacion.material} />
        <ResultItem icon={<CheckCircle2 size={18} className="text-[--color-success]" />} label="Tratamiento" value={recomendacion.tratamiento} />
      </div>

      <p className="text-xs text-[--color-muted] text-center leading-relaxed px-2">
        Esta combinacion garantiza el mejor confort visual basado en el estilo de vida del cliente.
      </p>
    </div>
  );
}

function ResultItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-[--color-surface-raised] rounded-2xl px-4 py-4 ring-1 ring-[--color-border-strong]">
      <span className="shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[--color-muted]">{label}</p>
        <p className="text-sm font-medium text-[--color-foreground] mt-0.5">{value}</p>
      </div>
    </div>
  );
}
