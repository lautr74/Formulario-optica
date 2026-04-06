'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, RotateCcw, Eye, Glasses, Sun, Car, Monitor, Clock, Check } from 'lucide-react';

type StepId = 'edad' | 'digital' | 'conduccion' | 'exteriores' | 'graduacion' | 'resultado';

interface FormData {
  edad: string;
  digital: string;
  conduccion: string;
  exteriores: string;
  potenciaTotal: string;
  adicion: string;
}

const initialData: FormData = {
  edad: '',
  digital: '',
  conduccion: '',
  exteriores: '',
  potenciaTotal: '',
  adicion: '',
};

const steps: StepId[] = ['edad', 'digital', 'conduccion', 'exteriores', 'graduacion', 'resultado'];

export default function CuestionarioOptica() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);

  const stepId = steps[currentStep];
  const isResult = stepId === 'resultado';
  const progress = ((currentStep + 1) / steps.length) * 100;

  const canProceed = () => {
    switch (stepId) {
      case 'edad': return !!data.edad;
      case 'digital': return !!data.digital;
      case 'conduccion': return !!data.conduccion;
      case 'exteriores': return !!data.exteriores;
      case 'graduacion': return !!data.potenciaTotal;
      default: return true;
    }
  };

  const handleSelect = (field: keyof FormData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (canProceed() && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const restart = () => {
    setData(initialData);
    setCurrentStep(0);
  };

  const getRecomendacion = () => {
    const potencia = Math.abs(parseFloat(data.potenciaTotal) || 0);
    const adicion = parseFloat(data.adicion) || 0;

    let material = 'Indice 1.50 Estandar';
    if (potencia > 4.25) material = 'Indice 1.67 / 1.74 Ultra Fino';
    else if (potencia >= 2.25) material = 'Indice 1.60 Airwear';

    let diseno = 'Varilux Comfort Max';
    if (data.edad === 'menos40' || data.digital === 'intensivo') diseno = 'Eyezen Relajacion Visual';
    if (adicion > 1.5) diseno = 'Varilux XR Series';
    if (data.digital === 'intensivo' && adicion > 0) diseno = 'Varilux Digitime';

    let tratamiento = 'Crizal Sapphire HR';
    if (data.conduccion === 'noche') tratamiento = 'Crizal Drive';
    if (data.exteriores === 'aireLibre') tratamiento = 'Transitions Gen S';

    return { material, diseno, tratamiento };
  };

  const recomendacion = getRecomendacion();

  return (
    <div className="min-h-dvh bg-[--color-background] flex flex-col">
      {/* Header */}
      <header className="bg-[--color-surface] border-b border-[--color-border] px-5 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative bg-white rounded-lg shadow-sm border border-[--color-border]" style={{ width: 44, height: 44 }}>
              <Image
                src="/optica%20calpe.png"
                alt="Optica Costa Blanca"
                fill
                className="object-contain p-1"
                sizes="44px"
                priority
              />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-[--color-foreground] tracking-tight">
                Optica Costa Blanca
              </h1>
              <p className="text-xs text-[--color-foreground-muted]">Asesor de lentes Essilor</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-[--color-surface] border-b border-[--color-border]">
        <div className="max-w-md mx-auto px-5 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[--color-foreground-muted] uppercase tracking-wider">
              {isResult ? 'Resultado' : `Paso ${currentStep + 1} de ${steps.length - 1}`}
            </span>
            <span className="text-xs font-semibold text-[--color-accent]">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1.5 bg-[--color-surface-subtle] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[--color-accent] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-5 py-6 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {stepId === 'edad' && (
              <QuestionCard
                icon={<Clock className="text-[--color-accent]" size={24} />}
                title="Rango de edad del cliente"
                description="Nos ayuda a determinar el tipo de lente mas adecuado"
              >
                <OptionGroup
                  options={[
                    { id: 'menos40', label: 'Menos de 40 anos' },
                    { id: '40-50', label: 'Entre 40 y 50 anos' },
                    { id: 'mas50', label: 'Mas de 50 anos' },
                  ]}
                  selected={data.edad}
                  onSelect={(id) => handleSelect('edad', id)}
                />
              </QuestionCard>
            )}

            {stepId === 'digital' && (
              <QuestionCard
                icon={<Monitor className="text-[--color-accent]" size={24} />}
                title="Uso de dispositivos digitales"
                description="Tiempo diario frente a pantallas, movil u ordenador"
              >
                <OptionGroup
                  options={[
                    { id: 'ocasional', label: 'Ocasional', sublabel: 'Menos de 3 horas' },
                    { id: 'moderado', label: 'Moderado', sublabel: '3 a 6 horas' },
                    { id: 'intensivo', label: 'Intensivo', sublabel: 'Mas de 6 horas' },
                  ]}
                  selected={data.digital}
                  onSelect={(id) => handleSelect('digital', id)}
                />
              </QuestionCard>
            )}

            {stepId === 'conduccion' && (
              <QuestionCard
                icon={<Car className="text-[--color-accent]" size={24} />}
                title="Habitos de conduccion"
                description="Frecuencia y condiciones de conduccion habituales"
              >
                <OptionGroup
                  options={[
                    { id: 'ocasional', label: 'No conduzco', sublabel: 'O muy ocasionalmente' },
                    { id: 'dia', label: 'Conduccion diurna', sublabel: 'Principalmente de dia' },
                    { id: 'noche', label: 'Conduccion nocturna', sublabel: 'Frecuentemente de noche' },
                  ]}
                  selected={data.conduccion}
                  onSelect={(id) => handleSelect('conduccion', id)}
                />
              </QuestionCard>
            )}

            {stepId === 'exteriores' && (
              <QuestionCard
                icon={<Sun className="text-[--color-accent]" size={24} />}
                title="Actividad en exteriores"
                description="Exposicion habitual a la luz solar"
              >
                <OptionGroup
                  options={[
                    { id: 'interior', label: 'Mayormente interiores', sublabel: 'Oficina o casa' },
                    { id: 'mixto', label: 'Uso mixto', sublabel: 'Entra y sale frecuentemente' },
                    { id: 'aireLibre', label: 'Aire libre', sublabel: 'Mucho tiempo en exterior' },
                  ]}
                  selected={data.exteriores}
                  onSelect={(id) => handleSelect('exteriores', id)}
                />
              </QuestionCard>
            )}

            {stepId === 'graduacion' && (
              <QuestionCard
                icon={<Eye className="text-[--color-accent]" size={24} />}
                title="Datos de graduacion"
                description="Informacion tecnica para la recomendacion del material"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[--color-foreground] mb-2">
                      Potencia total (esfera + cilindro)
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      placeholder="Ej: -3.25"
                      value={data.potenciaTotal}
                      onChange={(e) => handleSelect('potenciaTotal', e.target.value)}
                      className="w-full px-4 py-3.5 bg-[--color-surface] border border-[--color-border] rounded-xl text-[--color-foreground] placeholder:text-[--color-foreground-muted] focus:outline-none focus:border-[--color-accent] focus:ring-2 focus:ring-[--color-accent-subtle] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[--color-foreground] mb-2">
                      Adicion (si aplica)
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      placeholder="Ej: 1.50"
                      value={data.adicion}
                      onChange={(e) => handleSelect('adicion', e.target.value)}
                      className="w-full px-4 py-3.5 bg-[--color-surface] border border-[--color-border] rounded-xl text-[--color-foreground] placeholder:text-[--color-foreground-muted] focus:outline-none focus:border-[--color-accent] focus:ring-2 focus:ring-[--color-accent-subtle] transition"
                    />
                  </div>
                </div>
              </QuestionCard>
            )}

            {isResult && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[--color-success-subtle] mb-2">
                    <Glasses className="text-[--color-success]" size={28} />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-[--color-foreground]">
                    Recomendacion personalizada
                  </h2>
                  <p className="text-sm text-[--color-foreground-muted]">
                    Basada en el perfil visual del cliente
                  </p>
                </div>

                <div className="bg-[--color-surface] rounded-2xl border border-[--color-border] overflow-hidden shadow-sm">
                  <div className="bg-[--color-accent] px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-1">Diseno recomendado</p>
                    <p className="text-xl font-bold text-white">{recomendacion.diseno}</p>
                  </div>
                  <div className="divide-y divide-[--color-border]">
                    <ResultRow label="Material" value={recomendacion.material} />
                    <ResultRow label="Tratamiento" value={recomendacion.tratamiento} />
                  </div>
                </div>

                <p className="text-xs text-center text-[--color-foreground-muted] px-4 leading-relaxed">
                  Esta recomendacion esta basada en las respuestas proporcionadas y los criterios de Essilor para la seleccion optima de lentes.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-[--color-surface] border-t border-[--color-border] px-5 py-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {currentStep > 0 && !isResult && (
            <button
              onClick={prevStep}
              className="px-5 py-3 text-sm font-medium text-[--color-foreground-muted] hover:text-[--color-foreground] transition"
            >
              Atras
            </button>
          )}

          {isResult ? (
            <button
              onClick={restart}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[--color-surface-subtle] text-[--color-foreground] rounded-xl font-semibold text-sm border border-[--color-border] hover:bg-[--color-border] transition active:scale-[0.98]"
            >
              <RotateCcw size={18} />
              Nuevo cuestionario
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[--color-accent] text-white rounded-xl font-semibold text-sm hover:bg-[--color-accent-light] transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
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

function QuestionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-[--color-accent-subtle] flex items-center justify-center">
          {icon}
        </div>
        <div className="pt-1">
          <h2 className="text-xl font-semibold text-[--color-foreground] leading-tight">{title}</h2>
          <p className="text-sm text-[--color-foreground-muted] mt-1">{description}</p>
        </div>
      </div>
      <div className="pt-2">{children}</div>
    </div>
  );
}

function OptionGroup({
  options,
  selected,
  onSelect,
}: {
  options: { id: string; label: string; sublabel?: string }[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {options.map((option) => {
        const isSelected = selected === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl border text-left transition-all active:scale-[0.98] ${
              isSelected
                ? 'bg-[--color-accent-subtle] border-[--color-accent] shadow-sm'
                : 'bg-[--color-surface] border-[--color-border] hover:border-[--color-border-strong]'
            }`}
          >
            <div
              className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                isSelected ? 'border-[--color-accent] bg-[--color-accent]' : 'border-[--color-border-strong]'
              }`}
            >
              {isSelected && <Check size={12} className="text-white" />}
            </div>
            <div>
              <p className={`font-medium ${isSelected ? 'text-[--color-accent]' : 'text-[--color-foreground]'}`}>
                {option.label}
              </p>
              {option.sublabel && (
                <p className="text-xs text-[--color-foreground-muted] mt-0.5">{option.sublabel}</p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <Check size={18} className="text-[--color-success] shrink-0" />
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-[--color-foreground-muted]">{label}</p>
        <p className="text-sm font-medium text-[--color-foreground] mt-0.5">{value}</p>
      </div>
    </div>
  );
}
