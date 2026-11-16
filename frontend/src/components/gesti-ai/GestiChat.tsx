
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion';

import {
  Bot,
  Send,
  Sparkles,
  X,
  LoaderCircle,
  MessageCircle,
} from 'lucide-react';

import { api, getErrorMessage } from '../../lib/api';

type ChatMessage = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
};

const quickQuestions = [
  'Dame un resumen del inventario',
  '¿Qué productos tienen stock bajo?',
  'Muéstrame los últimos movimientos',
];

export function GestiChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const reduceMotion = useReducedMotion();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      role: 'assistant',
      text:
        '¡Hola! 👋 Soy Gesti, tu asistente de inventarios.\n\n' +
        'Puedo ayudarte con productos, existencias, ' +
        'entradas, salidas y alertas de stock.\n\n' +
        '¿Qué deseas consultar?',
    },
  ]);

  const nextId = useRef(1);
  const sendingRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Desplazar el chat al último mensaje
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight;
    }
  }, [messages, sending, open]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function addMessage(
    role: 'user' | 'assistant',
    text: string,
  ) {
    setMessages((previous) => [
      ...previous,
      {
        id: nextId.current++,
        role,
        text,
      },
    ]);
  }

  async function ask(question: string) {
    const value = question.trim();

    if (
      !value ||
      value.length > 400 ||
      sendingRef.current
    ) {
      return;
    }

    sendingRef.current = true;

    addMessage('user', value);
    setInput('');
    setSending(true);

    try {
      const response = await api.post<{
        message: string;
        mode: string;
      }>('/gesti-ai/ask', {
        question: value,
      });

      addMessage(
        'assistant',
        response.data.message ||
          'No pude generar una respuesta.',
      );
    } catch (error) {
      addMessage(
        'assistant',
        'No pude completar tu consulta.\n\n' +
          getErrorMessage(error),
      );
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    void ask(input);
  }

 
  const chatAnimation = {
    initial: reduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          x: 55,
          y: 45,
          scale: 0.88,
          filter: 'blur(12px)',
        },

    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
    },

    exit: reduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          x: 35,
          y: 30,
          scale: 0.9,
          filter: 'blur(8px)',
        },
  };

  return (
    <div
      className="
        fixed bottom-5 right-5 z-[100]
        flex flex-col items-end gap-4
        sm:bottom-6 sm:right-6
      "
    >
      <AnimatePresence>
        {open && (
          <motion.section
            key="gesti-chat"
            role="dialog"
            aria-label="Gesti AI"
            initial={chatAnimation.initial}
            animate={chatAnimation.animate}
            exit={chatAnimation.exit}
            transition={
              reduceMotion
                ? { duration: 0.15 }
                : {
                    type: 'spring',
                    stiffness: 260,
                    damping: 27,
                    mass: 0.85,
                  }
            }
            style={{
              transformOrigin: 'bottom right',
            }}
            className="
              relative flex
              h-[min(560px,75dvh)]
              w-[calc(100vw-2.5rem)]
              max-w-[400px]
              flex-col overflow-hidden
              rounded-2xl
              border border-signal/40
              bg-surface
              shadow-[0_0_40px_rgba(0,170,255,0.15),0_20px_60px_rgba(0,0,0,0.45)]
            "
          >
            {/* Barrido holográfico al abrir */}
            {!reduceMotion && (
              <motion.div
                initial={{
                  top: '0%',
                  opacity: 0,
                }}
                animate={{
                  top: '100%',
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 0.95,
                  ease: 'easeInOut',
                  delay: 0.12,
                }}
                className="
                  pointer-events-none
                  absolute inset-x-0 z-30
                  h-[2px]
                  bg-gradient-to-r
                  from-transparent
                  via-cyan-400
                  to-transparent
                  shadow-[0_0_24px_4px_rgba(34,211,238,0.55)]
                "
              />
            )}

            {}
            <div
              className="
                pointer-events-none
                absolute -right-16 -top-16
                h-48 w-48 rounded-full
                bg-signal/10 blur-3xl
              "
            />

            {/* Cabecera */}
            <div
              className="
                relative z-10 flex items-center
                gap-3 border-b border-border
                bg-base/95 p-4
              "
            >
              <motion.div
                animate={
                  reduceMotion
                    ? {}
                    : {
                        boxShadow: [
                          '0 0 8px rgba(0,180,255,0.15)',
                          '0 0 24px rgba(0,180,255,0.40)',
                          '0 0 8px rgba(0,180,255,0.15)',
                        ],
                      }
                }
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="
                  flex h-12 w-12 shrink-0
                  items-center justify-center
                  rounded-xl border border-signal/30
                  bg-signal/15 text-signal
                "
              >
                <Bot className="h-6 w-6" />
              </motion.div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2
                    className="
                      font-display text-base
                      font-bold text-ink
                    "
                  >
                    GESTI AI
                  </h2>

                  <Sparkles
                    className="h-4 w-4 text-signal"
                  />
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="
                      h-2 w-2 rounded-full
                      bg-emerald-400
                      shadow-[0_0_8px_rgba(52,211,153,0.6)]
                    "
                  />

                  <span className="text-xs text-ink-muted">
                    Asistente local · Gratis
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar Gesti AI"
                className="
                  rounded-lg p-2 text-ink-muted
                  transition-colors
                  hover:bg-signal/10
                  hover:text-ink
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {}
            <div
              className="
                h-px bg-gradient-to-r
                from-transparent
                via-signal
                to-transparent
              "
            />

            {/* Mensajes */}
            <div
              ref={scrollRef}
              aria-live="polite"
              aria-relevant="additions"
              className="
                relative z-10 flex-1
                space-y-4 overflow-y-auto
                bg-base/40 p-4
              "
            >
              {messages.map((message) => {
                const isUser =
                  message.role === 'user';

                return (
                  <motion.div
                    key={message.id}
                    initial={
                      reduceMotion
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            y: 12,
                            scale: 0.97,
                          }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.28,
                      ease: 'easeOut',
                    }}
                    className={`flex ${
                      isUser
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`
                        max-w-[90%]
                        whitespace-pre-wrap
                        break-words
                        rounded-2xl
                        px-4 py-3
                        text-sm leading-relaxed
                        ${
                          isUser
                            ? 'rounded-br-sm bg-signal text-white shadow-lg shadow-signal/10'
                            : 'rounded-bl-sm border border-border bg-surface text-ink'
                        }
                      `}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                );
              })}

              {sending && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="
                    flex items-center gap-2
                    text-sm text-ink-muted
                  "
                >
                  <LoaderCircle
                    className="
                      h-4 w-4 animate-spin
                      text-signal
                    "
                  />

                  Gesti está consultando tu inventario...
                </motion.div>
              )}
            </div>

            {}
            {messages.length === 1 && (
              <div
                className="
                  relative z-10 flex flex-wrap
                  gap-2 border-t border-border
                  bg-surface px-3 py-3
                "
              >
                {quickQuestions.map((question) => (
                  <motion.button
                    key={question}
                    type="button"
                    disabled={sending}
                    whileHover={
                      reduceMotion
                        ? {}
                        : { scale: 1.035 }
                    }
                    whileTap={
                      reduceMotion
                        ? {}
                        : { scale: 0.97 }
                    }
                    onClick={() => void ask(question)}
                    className="
                      rounded-full border
                      border-signal/30
                      bg-signal/10
                      px-3 py-2
                      text-left text-xs
                      text-signal
                      transition-colors
                      hover:bg-signal/20
                      disabled:opacity-50
                    "
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Campo de entrada */}
            <form
              onSubmit={handleSubmit}
              className="
                relative z-10 flex items-center
                gap-2 border-t border-border
                bg-surface p-3
              "
            >
              <input
                type="text"
                value={input}
                maxLength={400}
                disabled={sending}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                placeholder="Pregúntale a Gesti..."
                aria-label="Pregunta para Gesti AI"
                className="
                  min-w-0 flex-1
                  rounded-xl border border-border
                  bg-base px-3 py-3
                  text-sm text-ink
                  outline-none transition
                  focus:border-signal
                  focus:ring-2 focus:ring-signal/15
                  disabled:opacity-50
                "
              />

              <motion.button
                type="submit"
                disabled={!input.trim() || sending}
                whileHover={
                  reduceMotion
                    ? {}
                    : { scale: 1.07 }
                }
                whileTap={
                  reduceMotion
                    ? {}
                    : { scale: 0.92 }
                }
                aria-label="Enviar pregunta"
                className="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  rounded-xl bg-signal
                  text-white
                  shadow-lg shadow-signal/20
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {sending ? (
                  <LoaderCircle
                    className="h-5 w-5 animate-spin"
                  />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </motion.button>
            </form>

            {}
            <div
              className="
                relative z-10 border-t
                border-border bg-surface
                px-3 py-2 text-center
              "
            >
              <p className="text-[10px] text-ink-muted">
                GESTI AI · Sistema local de Gestock 2.0
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {}
      <motion.button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-label={
          open
            ? 'Cerrar asistente Gesti AI'
            : 'Abrir asistente Gesti AI'
        }
        aria-expanded={open}
        whileHover={
          reduceMotion
            ? {}
            : {
                scale: 1.1,
                rotate: 5,
              }
        }
        whileTap={
          reduceMotion
            ? {}
            : {
                scale: 0.9,
              }
        }
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 20,
        }}
        className="
          relative flex h-16 w-16
          items-center justify-center
          overflow-hidden rounded-full
          border border-white/20
          bg-signal text-white
          shadow-[0_0_28px_rgba(0,170,255,0.38)]
        "
      >
        {}
        {!reduceMotion && (
          <motion.span
            initial={{ x: '-180%' }}
            animate={{
              x: ['-180%', '220%'],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeInOut',
            }}
            className="
              pointer-events-none
              absolute inset-y-0
              w-8 rotate-12
              bg-white/25 blur-md
            "
          />
        )}

        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{
                opacity: 0,
                rotate: -90,
                scale: 0.6,
              }}
              animate={{
                opacity: 1,
                rotate: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                rotate: 90,
                scale: 0.6,
              }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-7 w-7" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{
                opacity: 0,
                rotate: -90,
                scale: 0.6,
              }}
              animate={{
                opacity: 1,
                rotate: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                rotate: 90,
                scale: 0.6,
              }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-7 w-7" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
