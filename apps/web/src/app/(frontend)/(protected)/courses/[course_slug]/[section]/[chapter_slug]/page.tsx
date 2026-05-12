// import { notFound } from "next/navigation";
// import { deesseAuth } from "@/lib/deesse";
// import { headers } from "next/headers";
// import { MDXContent } from "@/components/markdown/mdx-content";
// import { ChapterNavigation } from "@/components/markdown/chapter-navigation";
// import matter from "gray-matter";
// import fs from "fs";
// import path from "path";

// // ISR: Revalidate course pages every hour
// export const revalidate = 3600

// interface Chapter {
//   slug: string;
//   title: string;
//   order: number;
// }

// interface Section {
//   title: string;
//   chapters: Chapter[];
// }

// interface PathParams {
//   course_slug: string;
//   section: string;
//   chapter_slug: string;
// }

// function getAllPaths(): PathParams[] {
//   const courses = ['python-introduction', 'advanced-python'];
//   const paths: PathParams[] = [];

//   for (const courseSlug of courses) {
//     const courseDir = path.join(process.cwd(), "src", "content", "courses", courseSlug);
//     if (!fs.existsSync(courseDir)) continue;

//     const sections = fs.readdirSync(courseDir, { withFileTypes: true })
//       .filter(entry => entry.isDirectory())
//       .map(entry => entry.name);

//     for (const section of sections) {
//       const sectionDir = path.join(courseDir, section);
//       const files = fs.readdirSync(sectionDir).filter(f => f.endsWith('.mdx'));

//       for (const file of files) {
//         const chapterSlug = file.replace('.mdx', '');
//         paths.push({ course_slug: courseSlug, section, chapter_slug: chapterSlug });
//       }
//     }
//   }

//   return paths;
// }

// export async function generateStaticParams(): Promise<PathParams[]> {
//   return getAllPaths();
// }

// function getCourseSections(courseSlug: string): Section[] {
//   const sections: Record<string, Section[]> = {
//     'python-introduction': [
//       {
//         title: 'Introduction',
//         chapters: [
//           { slug: 'what-is-python', title: 'What is Python?', order: 1 },
//           { slug: 'python-vs-other-languages', title: 'Python vs Other Languages', order: 2 },
//           { slug: 'setting-up-environment', title: 'Setup Environment', order: 3 },
//           { slug: 'first-python-script', title: 'First Script', order: 4 },
//         ],
//       },
//       {
//         title: 'Basic Syntax',
//         chapters: [
//           { slug: 'variables-and-data-types', title: 'Variables & Types', order: 1 },
//           { slug: 'operators', title: 'Operators', order: 2 },
//           { slug: 'comments-and-formatting', title: 'Comments & Formatting', order: 3 },
//         ],
//       },
//       {
//         title: 'Control Flow',
//         chapters: [
//           { slug: 'if-statements', title: 'Conditionals', order: 1 },
//           { slug: 'for-loop', title: 'For Loop & range()', order: 2 },
//           { slug: 'while-loop', title: 'While Loop', order: 3 },
//           { slug: 'break-continue-pass', title: 'Break, Continue, Pass', order: 4 },
//           { slug: 'enumerate-and-zip', title: 'Enumerate & zip', order: 5 },
//         ],
//       },
//       {
//         title: 'Functions',
//         chapters: [
//           { slug: 'defining-functions', title: 'Defining Functions', order: 1 },
//           { slug: 'parameters-and-return', title: 'Parameters & Return', order: 2 },
//           { slug: 'variable-scope', title: 'Variable Scope', order: 3 },
//           { slug: 'lambda-functions', title: 'Lambda Functions', order: 4 },
//           { slug: 'type-annotations', title: 'Type Annotations', order: 5 },
//           { slug: 'positional-and-named-arguments', title: 'Positional & Named Args', order: 6 },
//         ],
//       },
//       {
//         title: 'Data Structures',
//         chapters: [
//           { slug: 'lists', title: 'Lists', order: 1 },
//           { slug: 'tuples', title: 'Tuples & Immutability', order: 2 },
//           { slug: 'sets', title: 'Sets', order: 3 },
//           { slug: 'dictionaries', title: 'Dictionaries', order: 4 },
//         ],
//       },
//       {
//         title: 'Strings',
//         chapters: [
//           { slug: 'string-creation', title: 'String Creation', order: 1 },
//           { slug: 'string-methods', title: 'String Methods', order: 2 },
//           { slug: 'string-formatting', title: 'String Formatting', order: 3 },
//         ],
//       },
//       {
//         title: 'File Operations',
//         chapters: [
//           { slug: 'reading-files', title: 'Reading Files', order: 1 },
//           { slug: 'writing-files', title: 'Writing Files', order: 2 },
//           { slug: 'working-with-paths', title: 'Working with Paths', order: 3 },
//         ],
//       },
//       {
//         title: 'Modules and Packages',
//         chapters: [
//           { slug: 'importing-modules', title: 'Importing Modules', order: 1 },
//           { slug: 'standard-library-overview', title: 'Std Library', order: 2 },
//           { slug: 'using-pip-and-virtual-environments', title: 'Pip & Venv', order: 3 },
//         ],
//       },
//       {
//         title: 'Error Handling',
//         chapters: [
//           { slug: 'try-and-except-blocks', title: 'Try & Except', order: 1 },
//           { slug: 'raising-exceptions', title: 'Raising Exceptions', order: 2 },
//           { slug: 'custom-exceptions', title: 'Custom Exceptions', order: 3 },
//         ],
//       },
//       {
//         title: 'Introduction to OOP',
//         chapters: [
//           { slug: 'classes-and-objects', title: 'Classes & Objects', order: 1 },
//           { slug: 'attributes-and-methods', title: 'Attributes & Methods', order: 2 },
//           { slug: 'inheritance-basics', title: 'Inheritance', order: 3 },
//         ],
//       },
//     ],
//     'advanced-python': [
//       {
//         title: 'Advanced Functions',
//         chapters: [
//           { slug: 'decorators', title: 'Decorators', order: 1 },
//           { slug: 'functools-module', title: 'functools Module', order: 2 },
//           { slug: 'generators', title: 'Generators', order: 3 },
//           { slug: 'context-managers', title: 'Context Managers', order: 4 },
//           { slug: 'walrus-operator', title: 'Walrus Operator', order: 5 },
//         ],
//       },
//       {
//         title: 'Advanced Data Structures',
//         chapters: [
//           { slug: 'collections-module', title: 'Collections Module', order: 1 },
//           { slug: 'chainmap-namedtuple', title: 'ChainMap & namedtuple', order: 2 },
//           { slug: 'comprehensions', title: 'Comprehensions', order: 3 },
//           { slug: 'sorting-custom-keys', title: 'Sorting', order: 4 },
//         ],
//       },
//       {
//         title: 'Object-Oriented Programming',
//         chapters: [
//           { slug: 'multiple-inheritance-mro', title: 'Multiple Inheritance', order: 1 },
//           { slug: 'super-cooperative-mro', title: 'Super() & MRO', order: 2 },
//           { slug: 'abstract-classes-interfaces', title: 'Abstract Classes', order: 3 },
//           { slug: 'enumerations', title: 'Enumerations', order: 4 },
//           { slug: 'property-decorator', title: 'Properties', order: 5 },
//           { slug: 'dunder-methods', title: 'Dunder Methods', order: 6 },
//           { slug: 'dataclasses', title: 'Data Classes', order: 7 },
//           { slug: 'descriptors', title: 'Descriptors', order: 8 },
//           { slug: 'structural-pattern-matching', title: 'Pattern Matching', order: 9 },
//         ],
//       },
//       {
//         title: 'Metaprogramming',
//         chapters: [
//           { slug: 'init-new-call', title: '__init__, __new__, __call__', order: 1 },
//           { slug: 'slots', title: '__slots__', order: 2 },
//           { slug: 'metaclasses', title: 'Metaclasses', order: 3 },
//           { slug: 'class-creation-patterns', title: 'Class Creation', order: 4 },
//         ],
//       },
//       {
//         title: 'Advanced Type Annotations',
//         chapters: [
//           { slug: 'generic-types', title: 'Generic Types', order: 1 },
//           { slug: 'union-optional-literal', title: 'Union & Optional', order: 2 },
//           { slug: 'type-aliases-newtype', title: 'Type Aliases', order: 3 },
//           { slug: 'typeddict', title: 'TypedDict', order: 4 },
//           { slug: 'protocols-structural-typing', title: 'Protocols', order: 5 },
//           { slug: 'typevar-bounded-generics', title: 'TypeVar & Generics', order: 6 },
//           { slug: 'self-conditional-types', title: 'Self Types', order: 7 },
//           { slug: 'overload', title: '@overload', order: 8 },
//           { slug: 'override', title: '@override', order: 9 },
//           { slug: 'final', title: '@final', order: 10 },
//         ],
//       },
//       {
//         title: 'Collections and Iterators',
//         chapters: [
//           { slug: 'collections-abc', title: 'collections.abc', order: 1 },
//           { slug: 'custom-iterables', title: 'Custom Iterables', order: 2 },
//           { slug: 'abcs-interfaces', title: 'ABCs for Interfaces', order: 3 },
//         ],
//       },
//       {
//         title: 'Concurrency and Parallelism',
//         chapters: [
//           { slug: 'threading-gil', title: 'Threading & GIL', order: 1 },
//           { slug: 'multiprocessing', title: 'Multiprocessing', order: 2 },
//           { slug: 'asyncio-fundamentals', title: 'AsyncIO', order: 3 },
//           { slug: 'await-async-task', title: 'async/await', order: 4 },
//           { slug: 'concurrent-futures', title: 'Concurrent.futures', order: 5 },
//           { slug: 'exception-groups-taskgroup', title: 'Exception Groups', order: 6 },
//         ],
//       },
//       {
//         title: 'Testing and Debugging',
//         chapters: [
//           { slug: 'unit-testing', title: 'Unit Testing', order: 1 },
//           { slug: 'fixtures-mocking', title: 'Fixtures & Mocking', order: 2 },
//           { slug: 'coverage-analysis', title: 'Coverage', order: 3 },
//           { slug: 'debugging-pdb', title: 'Debugging', order: 4 },
//         ],
//       },
//       {
//         title: 'Design Patterns',
//         chapters: [
//           { slug: 'singleton-factory', title: 'Singleton & Factory', order: 1 },
//           { slug: 'observer-pattern', title: 'Observer', order: 2 },
//           { slug: 'strategy-state', title: 'Strategy & State', order: 3 },
//           { slug: 'builder-prototype', title: 'Builder & Prototype', order: 4 },
//         ],
//       },
//       {
//         title: 'Working with External Data',
//         chapters: [
//           { slug: 'json-pickle', title: 'JSON & Pickle', order: 1 },
//           { slug: 'yaml-parsing', title: 'YAML', order: 2 },
//           { slug: 'regular-expressions', title: 'Regex', order: 3 },
//           { slug: 'csv-pandas', title: 'CSV & Pandas', order: 4 },
//         ],
//       },
//       {
//         title: 'Production Python',
//         chapters: [
//           { slug: 'logging-configuration', title: 'Logging', order: 1 },
//           { slug: 'environment-variables-config', title: 'Env Variables', order: 2 },
//           { slug: 'venv-dependency-management', title: 'Venv & Deps', order: 3 },
//           { slug: 'type-checking-mypy', title: 'Type Checking', order: 4 },
//           { slug: 'code-formatting-black-ruff', title: 'Formatting', order: 5 },
//         ],
//       },
//     ],
//   };
//   return sections[courseSlug] || [];
// }

// async function getChapterContent(courseSlug: string, section: string, chapterSlug: string) {
//   const filePath = path.join(
//     process.cwd(),
//     "src",
//     "content",
//     "courses",
//     courseSlug,
//     section,
//     `${chapterSlug}.mdx`
//   );

//   if (!fs.existsSync(filePath)) {
//     return null;
//   }

//   const fileContent = fs.readFileSync(filePath, "utf-8");
//   const { content } = matter(fileContent);
//   return content;
// }

// interface PageProps {
//   params: Promise<{
//     course_slug: string;
//     section: string;
//     chapter_slug: string;
//   }>;
// }

// export default async function Page({ params }: PageProps) {
//   const { course_slug, section, chapter_slug } = await params;

//   const session = await deesseAuth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session) {
//     notFound();
//   }

//   const content = await getChapterContent(course_slug, section, chapter_slug);

//   if (!content) {
//     notFound();
//   }

//   const sections = getCourseSections(course_slug);
//   const allChapters: { title: string; href: string }[] = [];

//   for (const sec of sections) {
//     const sectionSlug = sec.title.toLowerCase().replace(/\s+/g, '-');
//     for (const chapter of sec.chapters) {
//       allChapters.push({
//         title: chapter.title,
//         href: `/courses/${course_slug}/${sectionSlug}/${chapter.slug}`,
//       });
//     }
//   }

//   const currentIndex = allChapters.findIndex(
//     (ch) => ch.href === `/courses/${course_slug}/${section}/${chapter_slug}`
//   );

//   const prev = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
//   const next = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

//   return (
//     <article className="prose prose-sm max-w-none">
//       <MDXContent source={content} />
//       <ChapterNavigation prev={prev} next={next} />
//     </article>
//   );
// }

import { notFound } from "next/navigation";

export default function Page() {
  notFound();
}
