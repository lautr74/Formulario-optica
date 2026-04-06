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
      ? 'Preguntas para el cliente'
      : 'Datos para el óptico';

  const getRecomendacion = () => {
    const potenciaTotal = data.potenciaTotal ?? 0;
    const adicion = data.adicion ?? 0;

    let material = 'Índice 1.50 (Estándar)';
    if (Math.abs(potenciaTotal) > 4.25) material = 'Índice 1.67/1.74 (Ultra fino)';
    else if (Math.abs(potenciaTotal) >= 2.25) material = 'Índice 1.60 / Airwear (20% más fino)';

    let diseno = 'Varilux Comfort Max';
    if (data.edad === 'menos40' || data.digital === 'intensivo') diseno = 'Eyezen (Relajación visual)';
    if (adicion > 1.5) diseno = 'Varilux XR series (IA conductual)';
    if (data.digital === 'intensivo' && adicion > 0) diseno = 'Varilux Digitime (Ocupacional)';

    let tratamiento = 'Crizal Sapphire HR';
    if (data.conduccion === 'noche') tratamiento = 'Crizal Drive (Antirreflejante para conducción)';
    if (data.exteriores === 'aireLibre') tratamiento = 'Transitions Gen S (Lentes inteligentes)';

    return { material, diseno, tratamiento };
  };

  const recomendacion = getRecomendacion();

  const handleNextStep = async () => {
    if (isResultStep) return;

    const isValid = await trigger(currentField, { shouldFocus: true });
    if (!isValid) return;

    setStep((currentStep) => Math.min(currentStep + 1, questionSteps.length));
  };

  const handlePreviousStep = () => {
    setStep((currentStep) => Math.max(currentStep - 1, 0));
  };

  const handleRestart = () => {
    reset(defaultValues);
    setStep(0);
  };

  const getOptionClasses = (isSelected: boolean) =>
    `flex items-center gap-3 p-4 rounded-2xl transition ring-1 ${
      isSelected
        ? 'bg-blue-600 text-white ring-blue-400 shadow-lg shadow-blue-600/20'
        : 'bg-zinc-800 hover:bg-zinc-700 ring-zinc-700'
    }`;

  const renderStep = () => {
    switch (currentField) {
      case 'edad':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Perfil</p>
              <h2 className="text-3xl font-semibold">¿Qué rango de edad tienes?</h2>
              <p className="text-zinc-400">Esto nos ayuda a perfilar el tipo de lente más adecuado para ti.</p>
            </div>

            <div className="grid gap-3">
              {[
                { id: 'menos40', label: 'Menos de 40 años' },
                { id: '40-50', label: '40 a 50 años' },
                { id: 'mas50', label: 'Más de 50 años' },
              ].map((item) => (
                <label key={item.id} className={getOptionClasses(data.edad === item.id)}>
                  <input type="radio" value={item.id} className="sr-only" {...register('edad')} />
                  <span className="text-base">{item.label}</span>
                </label>
              ))}
            </div>

            {errors.edad && <p className="text-sm text-red-400">{errors.edad.message}</p>}
          </div>
        );

      case 'digital':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Uso digital</p>
              <h2 className="text-3xl font-semibold">¿Cuánto usas dispositivos digitales?</h2>
              <p className="text-zinc-400">Pantallas, móvil, ordenador o tablet a lo largo del día.</p>
            </div>

            <div className="grid gap-3">
              {[
                { id: 'ocasional', label: 'Ocasional' },
                { id: 'moderado', label: 'Moderado (3-6h)' },
                { id: 'intensivo', label: 'Intensivo (+6h)' },
              ].map((item) => (
                <label key={item.id} className={getOptionClasses(data.digital === item.id)}>
                  <input type="radio" value={item.id} className="sr-only" {...register('digital')} />
                  <span className="text-base">{item.label}</span>
                </label>
              ))}
            </div>

            {errors.digital && <p className="text-sm text-red-400">{errors.digital.message}</p>}
          </div>
        );

      case 'conduccion':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Conducción</p>
              <h2 className="text-3xl font-semibold">¿Cómo es tu conducción habitual?</h2>
              <p className="text-zinc-400">Sobre todo nos interesa saber si conduces de noche o en condiciones exigentes.</p>
            </div>

            <div className="grid gap-3">
              {[
                { id: 'ocasional', label: 'No conduzco apenas', icon: <Settings size={18} /> },
                { id: 'dia', label: 'Sobre todo de día', icon: <Car size={18} /> },
                { id: 'noche', label: 'Conducción nocturna', icon: <Car size={18} /> },
              ].map((item) => (
                <label key={item.id} className={getOptionClasses(data.conduccion === item.id)}>
                  <input type="radio" value={item.id} className="sr-only" {...register('conduccion')} />
                  {item.icon}
                  <span className="text-base">{item.label}</span>
                </label>
              ))}
            </div>

            {errors.conduccion && <p className="text-sm text-red-400">{errors.conduccion.message}</p>}
          </div>
        );

      case 'exteriores':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Exterior</p>
              <h2 className="text-3xl font-semibold">¿Cómo es tu vida en exteriores?</h2>
              <p className="text-zinc-400">Buscamos entender tu exposición al sol y los cambios de luz del día.</p>
            </div>

            <div className="grid gap-3">
              {[
                { id: 'interior', label: 'Espacios interiores', icon: <Monitor size={18} /> },
                { id: 'mixto', label: 'Entra y sale con frecuencia', icon: <Settings size={18} /> },
                {
                  id: 'aireLibre',
                  label: 'Actividades al aire libre / Fotosensibilidad',
                  icon: <Sun size={18} />,
                },
              ].map((item) => (
                <label key={item.id} className={getOptionClasses(data.exteriores === item.id)}>
                  <input type="radio" value={item.id} className="sr-only" {...register('exteriores')} />
                  {item.icon}
                  <span className="text-base">{item.label}</span>
                </label>
              ))}
            </div>

            {errors.exteriores && <p className="text-sm text-red-400">{errors.exteriores.message}</p>}
          </div>
        );

      case 'od':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Datos técnicos del óptico</p>
              <h2 className="text-3xl font-semibold">¿Cuál es la graduación OD?</h2>
              <p className="text-zinc-400">Introduce la graduación en el formato habitual de la óptica.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-500 uppercase">Graduación OD</label>
              <input
                type="text"
                placeholder="Ej: -2.50"
                className="w-full bg-zinc-800 p-4 rounded-2xl outline-none ring-1 ring-zinc-700 focus:ring-blue-500"
                {...register('od')}
              />
              {errors.od && <p className="text-sm text-red-400">{errors.od.message}</p>}
            </div>
          </div>
        );

      case 'adicion':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Datos técnicos del óptico</p>
              <h2 className="text-3xl font-semibold">¿Cuál es la adición?</h2>
              <p className="text-zinc-400">Usa pasos de 0.25 si lo necesitas.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-500 uppercase">Adición (+)</label>
              <input
                type="number"
                step="0.25"
                placeholder="0.00"
                className="w-full bg-zinc-800 p-4 rounded-2xl outline-none ring-1 ring-zinc-700 focus:ring-blue-500"
                {...register('adicion', { setValueAs: parseOptionalNumber })}
              />
              {errors.adicion && <p className="text-sm text-red-400">{errors.adicion.message}</p>}
            </div>
          </div>
        );

      case 'potenciaTotal':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Datos técnicos del óptico</p>
              <h2 className="text-3xl font-semibold">¿Cuál es la potencia total?</h2>
              <p className="text-zinc-400">Este dato es clave para calcular el material del lente.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-500 uppercase">Potencia total (Esf + Cyl)</label>
              <input
                type="number"
                step="0.25"
                placeholder="Ej: -3.25"
                className="w-full bg-zinc-800 p-4 rounded-2xl outline-none ring-1 ring-zinc-700 focus:ring-blue-500"
                {...register('potenciaTotal', { setValueAs: parseOptionalNumber })}
              />
              {errors.potenciaTotal && (
                <p className="text-sm text-red-400">{errors.potenciaTotal.message}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 space-y-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white/95 p-1 shadow-lg shadow-black/20">
                <Image
                  src="/optica%20calpe.png"
                  alt="Logotipo de Optica Costa Blanca"
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-white">Optica Costa Blanca</h1>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{stepGroupLabel}</p>
              </div>
            </div>
            <div className="text-sm font-mono text-blue-400">
              Paso {Math.min(step + 1, totalSteps)} / {totalSteps}
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500">
              {isResultStep
                ? 'Resultado final listo'
                : isClientStep
                  ? 'Estas preguntas se le hacen directamente al cliente'
                  : 'En esta parte el óptico completa los datos técnicos'}
            </p>
          </div>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
              className="min-h-[360px] flex flex-col justify-center"
            >
              {isResultStep ? (
                <div className="space-y-6 text-center">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="inline-block p-4 bg-blue-600/20 rounded-full mb-2"
                  >
                    <Sparkles className="text-blue-400" size={40} />
                  </motion.div>
                  <h2 className="text-2xl font-bold">Solución Óptima Sugerida</h2>

                  <div className="bg-zinc-800/50 p-6 rounded-2xl border border-blue-500/30 space-y-4 text-left">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="text-green-500 shrink-0 mt-1" />
                      <p className="text-lg">
                        Tu lente ideal es{' '}
                        <span className="text-blue-400 font-bold">{recomendacion.diseno}</span>
                      </p>
                    </div>
                    <div className="pl-9 space-y-2 text-zinc-400">
                      <p>
                        • <strong>Material:</strong> {recomendacion.material}
                      </p>
                      <p>
                        • <strong>Tratamiento:</strong> {recomendacion.tratamiento}
                      </p>
                    </div>
                  </div>

                  <p className="text-zinc-500 text-sm italic mt-4">
                    Esta combinación garantiza el mejor confort visual basado en el estilo de vida
                    del cliente.
                  </p>
                </div>
              ) : (
                renderStep()
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex justify-between gap-3">
            {step > 0 ? (
              <button
                onClick={handlePreviousStep}
                className="flex items-center gap-2 px-6 py-3 text-zinc-400 hover:text-white transition"
              >
                <ChevronLeft size={20} /> Atrás
              </button>
            ) : (
              <div />
            )}

            {isResultStep ? (
              <button
                onClick={handleRestart}
                className="ml-auto px-8 py-3 bg-zinc-100 text-zinc-900 rounded-xl font-bold hover:bg-white transition"
              >
                Nuevo cuestionario
              </button>
            ) : (
              <button
                onClick={handleNextStep}
                className="ml-auto flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
              >
                Continuar <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
