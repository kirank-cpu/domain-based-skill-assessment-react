// Mock question bank. Structured for easy expandability:
//   QUESTIONS[domainId][levelId] = [ question, question, ... ]
//
// Each question:
//   { id, type: 'mcq' | 'scenario', question, code?, options: string[], answer: number(index), explanation }
//
// Add domains/levels/questions by extending this object — the UI adapts automatically.

export const QUESTIONS = {
  qa: {
    beginner: [
      {
        id: 'qa-b-1',
        type: 'mcq',
        question: 'What is the primary goal of software testing?',
        options: [
          'To prove the software has no bugs',
          'To identify defects and verify the software meets requirements',
          'To write as much code as possible',
          'To replace the need for documentation',
        ],
        answer: 1,
        explanation:
          'Testing aims to find defects and verify that software behaves as expected against its requirements. It cannot prove the absence of all bugs.',
      },
      {
        id: 'qa-b-2',
        type: 'mcq',
        question: 'Which document describes what to test, how to test, and the testing scope?',
        options: ['Test Case', 'Test Plan', 'Bug Report', 'Requirement Spec'],
        answer: 1,
        explanation:
          'A Test Plan is the high-level document that defines scope, approach, resources, and schedule of testing activities.',
      },
      {
        id: 'qa-b-3',
        type: 'mcq',
        question: 'What is the difference between verification and validation?',
        options: [
          'They are exactly the same thing',
          'Verification: "Are we building it right?"; Validation: "Are we building the right thing?"',
          'Validation happens before verification always',
          'Verification is only done by customers',
        ],
        answer: 1,
        explanation:
          'Verification checks conformance to specifications ("building it right"), while validation checks the product meets user needs ("building the right thing").',
      },
      {
        id: 'qa-b-4',
        type: 'scenario',
        question:
          'A tester logs a defect. The developer marks it as "Cannot Reproduce". What is the BEST next step for the tester?',
        options: [
          'Immediately close the defect as invalid',
          'Re-open with detailed steps, environment, screenshots/logs, and exact test data',
          'Escalate to the CEO',
          'Delete the defect and move on',
        ],
        answer: 1,
        explanation:
          'Providing precise reproduction steps, environment details, and evidence helps the developer reproduce and fix the issue rather than dismissing it.',
      },
      {
        id: 'qa-b-5',
        type: 'mcq',
        question: 'Which of the following is a valid severity level for a defect?',
        options: ['Critical', 'Yellow', 'Fast', 'Optional'],
        answer: 0,
        explanation:
          'Severity levels typically include Critical, Major, Minor, and Trivial — reflecting the impact of a defect on the system.',
      },
    ],
    intermediate: [
      {
        id: 'qa-i-1',
        type: 'mcq',
        question:
          'In boundary value analysis, for an input field accepting values 1–100, which set best represents the boundary test values?',
        options: ['50, 51, 52', '0, 1, 2, 99, 100, 101', '1, 100', '25, 50, 75'],
        answer: 1,
        explanation:
          'BVA tests values at and around the boundaries: just below min (0), min (1), just above min (2), and similarly around the max (99, 100, 101).',
      },
      {
        id: 'qa-i-2',
        type: 'mcq',
        question: 'What is the main purpose of a Requirements Traceability Matrix (RTM)?',
        options: [
          'To track code coverage percentage',
          'To map requirements to their corresponding test cases ensuring full coverage',
          'To store bug screenshots',
          'To schedule daily standups',
        ],
        answer: 1,
        explanation:
          'An RTM ensures every requirement is covered by at least one test case, providing bidirectional traceability.',
      },
      {
        id: 'qa-i-3',
        type: 'scenario',
        question:
          'Regression testing after a hotfix is taking too long to run manually before each release. What is the MOST sustainable improvement?',
        options: [
          'Skip regression testing entirely to save time',
          'Automate the stable, repetitive regression suite and prioritize risk-based test selection',
          'Only test on the developer machine',
          'Run tests once a month',
        ],
        answer: 1,
        explanation:
          'Automating stable regression cases and applying risk-based prioritization gives fast, repeatable coverage without dropping quality.',
      },
      {
        id: 'qa-i-4',
        type: 'mcq',
        question:
          'Which testing technique groups inputs into partitions that are expected to be treated the same way?',
        options: [
          'Equivalence Partitioning',
          'Exploratory Testing',
          'Smoke Testing',
          'Load Testing',
        ],
        answer: 0,
        explanation:
          'Equivalence Partitioning divides input data into classes where any single value in a class is representative of the whole, reducing redundant tests.',
      },
      {
        id: 'qa-i-5',
        type: 'mcq',
        question: 'What distinguishes Smoke testing from Sanity testing?',
        options: [
          'They are identical',
          'Smoke verifies critical build stability broadly; Sanity narrowly checks specific functionality after minor changes',
          'Sanity is always automated; Smoke is always manual',
          'Smoke is done only in production',
        ],
        answer: 1,
        explanation:
          'Smoke testing is a broad, shallow check that the build is stable enough to test; Sanity is a narrow, deep check of specific new/changed functionality.',
      },
    ],
    complex: [
      {
        id: 'qa-c-1',
        type: 'scenario',
        question:
          'A payment gateway intermittently fails ~2% of transactions only under peak load, but never in the test environment. As QA lead, what is the STRONGEST diagnostic approach?',
        options: [
          'Mark it as "works on my machine" and close it',
          'Reproduce with production-like load testing, correlate logs/metrics/traces across services, and analyze concurrency & timeout thresholds',
          'Add more manual testers clicking the button',
          'Increase the timeout to 10 minutes and ship',
        ],
        answer: 1,
        explanation:
          'Intermittent, load-dependent failures require production-like load simulation plus distributed tracing and metric correlation to expose race conditions, resource exhaustion, or timeout misconfigurations.',
      },
      {
        id: 'qa-c-2',
        type: 'mcq',
        question:
          'When designing a test strategy for a microservices system, which combination best balances speed and confidence (per the test pyramid)?',
        options: [
          'Mostly end-to-end UI tests, few unit tests',
          'Many unit tests, fewer integration/contract tests, minimal end-to-end tests',
          'Only manual exploratory testing',
          'Equal numbers of every test type regardless of cost',
        ],
        answer: 1,
        explanation:
          'The test pyramid favors a large base of fast unit tests, a middle layer of integration/contract tests, and a small number of slow, brittle end-to-end tests.',
      },
      {
        id: 'qa-c-3',
        type: 'mcq',
        question: 'What is the purpose of consumer-driven contract testing between microservices?',
        options: [
          'To replace all unit tests',
          'To verify that a provider service meets the expectations (contract) defined by its consumers, catching breaking changes early',
          'To load test the database',
          'To measure UI rendering speed',
        ],
        answer: 1,
        explanation:
          'Contract testing (e.g., Pact) ensures a provider does not break the specific interactions its consumers rely on, without needing full end-to-end integration.',
      },
      {
        id: 'qa-c-4',
        type: 'scenario',
        question:
          'Your automated regression suite is "flaky" — the same tests pass and fail randomly, eroding team trust. What is the MOST effective long-term fix?',
        options: [
          'Add random sleeps everywhere and retry failing tests 5 times',
          'Root-cause flakiness (async waits, shared state, test data, ordering), fix synchronization/isolation, and quarantine + track flaky tests',
          'Delete every test that ever failed',
          'Only run tests that always pass',
        ],
        answer: 1,
        explanation:
          'Sustainable de-flaking means addressing root causes — improper waits, shared/dirty state, order dependence — and isolating tests, rather than masking with blanket retries and sleeps.',
      },
      {
        id: 'qa-c-5',
        type: 'mcq',
        question:
          'Which metric best indicates the effectiveness of your test suite at catching real defects?',
        options: [
          'Number of test cases written',
          'Defect Detection Percentage / escaped-defect rate (defects found in test vs. production)',
          'Lines of test code',
          'Number of testers on the team',
        ],
        answer: 1,
        explanation:
          'Defect Detection Percentage (defects caught before release ÷ total defects) directly measures how well testing prevents escapes to production.',
      },
    ],
  },

  'azure-data': {
    beginner: [
      {
        id: 'az-b-1',
        type: 'mcq',
        question: 'What is Azure Data Factory (ADF) primarily used for?',
        options: [
          'Hosting virtual machines',
          'Cloud-based data integration and ETL/ELT orchestration',
          'Sending emails',
          'Managing Active Directory users',
        ],
        answer: 1,
        explanation:
          'Azure Data Factory is a managed cloud service for orchestrating and automating data movement and transformation (ETL/ELT) at scale.',
      },
      {
        id: 'az-b-2',
        type: 'mcq',
        question: 'Which Azure storage service is optimized for big data analytics workloads?',
        options: [
          'Azure Data Lake Storage Gen2',
          'Azure Table Storage',
          'Azure Queue Storage',
          'Azure File Share',
        ],
        answer: 0,
        explanation:
          'ADLS Gen2 combines hierarchical namespace with Blob storage economics, purpose-built for analytics on large datasets.',
      },
      {
        id: 'az-b-3',
        type: 'mcq',
        question: 'In ADF, what is an "Integration Runtime"?',
        options: [
          'A billing dashboard',
          'The compute infrastructure used by ADF to perform data movement and dispatch activities',
          'A type of database index',
          'A visualization tool',
        ],
        answer: 1,
        explanation:
          'The Integration Runtime (IR) is the compute used by ADF for data flow execution, data movement, and activity dispatch across networks.',
      },
      {
        id: 'az-b-4',
        type: 'mcq',
        question: 'What does ETL stand for?',
        options: [
          'Extract, Transform, Load',
          'Evaluate, Test, Launch',
          'Encrypt, Transfer, Log',
          'Extend, Track, Link',
        ],
        answer: 0,
        explanation:
          'ETL = Extract data from sources, Transform it into the desired shape, and Load it into a target store.',
      },
      {
        id: 'az-b-5',
        type: 'scenario',
        question:
          'You need to copy CSV files landing daily in Blob Storage into an Azure SQL table with minimal code. Which ADF component do you use?',
        options: [
          'A Databricks cluster written from scratch',
          'The Copy Data activity with a scheduled trigger',
          'An Azure Function timer only',
          'Manual download and re-upload',
        ],
        answer: 1,
        explanation:
          'ADF\'s Copy Data activity handles source-to-sink movement declaratively, and a schedule trigger automates the daily run — no custom code required.',
      },
    ],
    intermediate: [
      {
        id: 'az-i-1',
        type: 'mcq',
        question:
          'In ADF, what is the difference between a Pipeline "trigger" of type Tumbling Window vs. Schedule?',
        options: [
          'They are identical',
          'Tumbling Window has state, supports backfill and dependencies with fixed-size, non-overlapping time windows; Schedule fires on a wall-clock recurrence',
          'Schedule triggers cannot be recurring',
          'Tumbling Window only works on-premises',
        ],
        answer: 1,
        explanation:
          'Tumbling Window triggers are stateful, retain window boundaries, support backfill and inter-window dependencies. Schedule triggers simply fire on a recurring wall-clock pattern.',
      },
      {
        id: 'az-i-2',
        type: 'mcq',
        question:
          'Which file format is generally BEST for analytical queries in a data lake due to columnar storage and compression?',
        options: ['CSV', 'JSON', 'Parquet', 'Plain text'],
        answer: 2,
        explanation:
          'Parquet is a columnar, compressed format enabling predicate pushdown and column pruning — far more efficient for analytics than row-based CSV/JSON.',
      },
      {
        id: 'az-i-3',
        type: 'scenario',
        question:
          'A Databricks job that reads a 500 GB dataset is running very slowly with many small files. What is the MOST impactful optimization?',
        options: [
          'Add more comments to the notebook',
          'Compact the many small files into fewer larger files (address the "small files problem") and use an optimized format like Delta/Parquet',
          'Switch to a smaller cluster',
          'Convert everything to CSV',
        ],
        answer: 1,
        explanation:
          'The "small files problem" causes excessive task/scheduling overhead. Compacting into larger Parquet/Delta files (e.g., OPTIMIZE) dramatically improves read throughput.',
      },
      {
        id: 'az-i-4',
        type: 'mcq',
        question: 'In Azure Synapse Analytics, what is a "dedicated SQL pool" best suited for?',
        options: [
          'Serverless ad-hoc queries with no provisioned resources',
          'Predictable, high-concurrency data warehousing with provisioned, scalable compute (DWUs)',
          'Real-time IoT streaming only',
          'Storing binary blobs',
        ],
        answer: 1,
        explanation:
          'A dedicated SQL pool provisions data warehouse compute (measured in DWUs) for consistent, high-performance analytical workloads, distinct from the serverless pool.',
      },
      {
        id: 'az-i-5',
        type: 'mcq',
        question:
          'What is the recommended way to store secrets (e.g., connection strings) referenced by ADF pipelines?',
        options: [
          'Hard-code them in the pipeline JSON',
          'Store them in Azure Key Vault and reference via linked service',
          'Put them in a public GitHub repo',
          'Email them to the team',
        ],
        answer: 1,
        explanation:
          'Azure Key Vault centrally and securely stores secrets; ADF linked services reference them at runtime, avoiding hard-coded credentials.',
      },
    ],
    complex: [
      {
        id: 'az-c-1',
        type: 'scenario',
        question:
          'You must design an incremental load from a large on-prem SQL source to a Delta Lake, capturing inserts, updates, and deletes with exactly-once semantics. Which approach is STRONGEST?',
        options: [
          'Full truncate-and-reload every run',
          'Change Data Capture (CDC) / watermark-based extraction into Delta with MERGE (upsert) and idempotent, checkpointed batches',
          'Randomly sample rows each night',
          'Copy the whole database as CSV daily',
        ],
        answer: 1,
        explanation:
          'CDC or high-watermark extraction feeding a Delta MERGE gives efficient incremental upserts/deletes; idempotent, checkpointed batches deliver exactly-once behavior without costly full reloads.',
      },
      {
        id: 'az-c-2',
        type: 'mcq',
        question:
          'In a Synapse dedicated SQL pool, a large fact table joined frequently to a small dim table suffers from data movement. Which distribution strategy helps MOST?',
        options: [
          'ROUND_ROBIN on both tables',
          'HASH-distribute the fact table on the join key and REPLICATE the small dimension table',
          'Distribute everything by REPLICATE',
          'Use a heap with no distribution',
        ],
        answer: 1,
        explanation:
          'Hash-distributing the large fact on the join key co-locates matching rows, and replicating the small dimension avoids shuffles — minimizing costly data movement.',
      },
      {
        id: 'az-c-3',
        type: 'scenario',
        question:
          'A streaming pipeline (Event Hubs → Databricks Structured Streaming → Delta) occasionally reprocesses events after a restart, creating duplicates downstream. What is the correct fix?',
        options: [
          'Ignore duplicates; they are unavoidable',
          'Use checkpointing plus idempotent writes / MERGE with a unique event key to guarantee exactly-once effective processing',
          'Disable checkpointing entirely',
          'Restart the cluster more often',
        ],
        answer: 1,
        explanation:
          'Structured Streaming checkpoints track progress; combining them with idempotent sinks (dedupe via unique keys / Delta MERGE) yields exactly-once effective semantics across restarts.',
      },
      {
        id: 'az-c-4',
        type: 'mcq',
        question:
          'Which layered design pattern is a best practice for organizing a Lakehouse for reliability and reusability?',
        options: [
          'A single flat folder with all files',
          'Medallion architecture: Bronze (raw) → Silver (cleansed/conformed) → Gold (curated/aggregated)',
          'Store raw and final data in the same table',
          'Only keep Gold data and delete raw',
        ],
        answer: 1,
        explanation:
          'The Medallion (Bronze/Silver/Gold) architecture progressively refines data, improving quality, lineage, and reusability across the Lakehouse.',
      },
      {
        id: 'az-c-5',
        type: 'mcq',
        question:
          'To govern data access, lineage, and discovery across many Azure data assets centrally, which service do you use?',
        options: [
          'Microsoft Purview',
          'Azure DevOps',
          'Azure CDN',
          'Azure Front Door',
        ],
        answer: 0,
        explanation:
          'Microsoft Purview provides unified data governance — cataloging, classification, lineage, and access policies — across your data estate.',
      },
    ],
  },

  'automation-qa': {
    beginner: [
      {
        id: 'au-b-1',
        type: 'mcq',
        question: 'What is Selenium WebDriver primarily used for?',
        options: [
          'Automating browser interactions for web application testing',
          'Compiling Java code',
          'Designing databases',
          'Editing images',
        ],
        answer: 0,
        explanation:
          'Selenium WebDriver programmatically drives real browsers to automate and test web application UI behavior.',
      },
      {
        id: 'au-b-2',
        type: 'mcq',
        question:
          'Which Selenium locator strategy is generally the MOST reliable and preferred when available?',
        options: [
          'Absolute XPath like /html/body/div[3]/div[2]',
          'A unique, stable id',
          'Linking by pixel coordinates',
          'The element background color',
        ],
        answer: 1,
        explanation:
          'A unique, stable id is fast and resilient. Absolute XPaths are brittle and break with any DOM change.',
      },
      {
        id: 'au-b-3',
        type: 'scenario',
        question:
          'Your test clicks a button before the page finishes loading and fails with "element not found". What is the correct fix?',
        options: [
          'Add Thread.sleep(30000) everywhere',
          'Use an explicit wait (WebDriverWait) for the element to be clickable',
          'Run the test on a faster machine',
          'Ignore the failure',
        ],
        answer: 1,
        explanation:
          'Explicit waits poll for a specific condition (e.g., elementToBeClickable), synchronizing the test with the app without arbitrary fixed sleeps.',
      },
      {
        id: 'au-b-4',
        type: 'mcq',
        question: 'What is an assertion in an automated test?',
        options: [
          'A comment describing the test',
          'A check that verifies actual behavior matches the expected result, failing the test if not',
          'A way to speed up the browser',
          'A type of loop',
        ],
        answer: 1,
        explanation:
          'Assertions validate expected vs. actual outcomes; a failed assertion marks the test as failed, which is the core of test verification.',
      },
      {
        id: 'au-b-5',
        type: 'mcq',
        question: 'Which of these is a popular test runner / framework for JavaScript E2E automation?',
        options: ['Cypress', 'Photoshop', 'Nginx', 'Kafka'],
        answer: 0,
        explanation:
          'Cypress is a widely used JavaScript end-to-end testing framework (alongside Playwright, WebdriverIO, etc.).',
      },
    ],
    intermediate: [
      {
        id: 'au-i-1',
        type: 'mcq',
        question: 'What is the main benefit of the Page Object Model (POM) design pattern?',
        options: [
          'It makes tests run faster on the GPU',
          'It encapsulates page structure/locators in reusable classes, reducing duplication and easing maintenance',
          'It removes the need for assertions',
          'It automatically writes test cases',
        ],
        answer: 1,
        explanation:
          'POM centralizes each page\'s elements and actions in a class, so UI changes require updates in one place — improving maintainability and reuse.',
      },
      {
        id: 'au-i-2',
        type: 'scenario',
        question:
          'A test suite must run against Chrome, Firefox, and Edge on every pull request. What is the BEST setup?',
        options: [
          'Manually run each browser on your laptop',
          'Parameterize the browser and run cross-browser tests in parallel via a CI pipeline (e.g., Grid/cloud providers)',
          'Only ever test Chrome',
          'Copy-paste the test three times with hardcoded browsers',
        ],
        answer: 1,
        explanation:
          'Parameterizing the driver and executing in parallel through CI (Selenium Grid, Playwright, or cloud grids) gives scalable, repeatable cross-browser coverage on every PR.',
      },
      {
        id: 'au-i-3',
        type: 'mcq',
        question:
          'What is the difference between implicit and explicit waits in Selenium?',
        options: [
          'They are the same',
          'Implicit wait sets a global polling timeout for element lookups; explicit wait waits for a specific condition on a specific element',
          'Explicit wait is global; implicit wait is per-element',
          'Only implicit waits work in headless mode',
        ],
        answer: 1,
        explanation:
          'Implicit waits apply a default timeout to all findElement calls, while explicit waits (WebDriverWait + ExpectedConditions) target a precise condition — and mixing them can cause unpredictable delays.',
      },
      {
        id: 'au-i-4',
        type: 'mcq',
        question: 'In API test automation, which tool/library is commonly used for REST assertions in Java?',
        options: ['REST Assured', 'Selenium IDE', 'JMeter GUI only', 'Notepad'],
        answer: 0,
        explanation:
          'REST Assured is a popular Java DSL for testing and validating REST APIs (status codes, headers, JSON body assertions).',
      },
      {
        id: 'au-i-5',
        type: 'scenario',
        question:
          'Test data created by one test is causing another test to fail because of shared state. What is the BEST practice?',
        options: [
          'Run tests in a fixed order and hope for the best',
          'Make each test independent and self-contained: set up its own data and clean up (or use isolated/fresh data per test)',
          'Delete the failing test',
          'Never create test data',
        ],
        answer: 1,
        explanation:
          'Independent, isolated tests with their own setup/teardown avoid order-dependence and shared-state flakiness, enabling reliable parallel execution.',
      },
    ],
    complex: [
      {
        id: 'au-c-1',
        type: 'scenario',
        question:
          'You are architecting an automation framework for a team of 20 across UI, API, and mobile. Which design maximizes maintainability and scale?',
        options: [
          'One giant test file with all scripts',
          'A layered framework: reusable core/utilities, Page Objects/service clients, data-driven config, tagged suites, and CI integration with reporting',
          'Hardcode every value and never refactor',
          'Record-and-playback only',
        ],
        answer: 1,
        explanation:
          'A modular, layered framework (utilities, page/service objects, externalized data, tagging, CI + rich reporting) scales across teams and test types while staying maintainable.',
      },
      {
        id: 'au-c-2',
        type: 'mcq',
        question:
          'Which strategy BEST reduces flaky end-to-end tests caused by asynchronous UI updates?',
        options: [
          'Increase all fixed sleeps to 60 seconds',
          'Use condition-based waits, retry only idempotent steps, stub/mocking of unstable externals, and deterministic test data',
          'Run tests fewer times',
          'Disable JavaScript in the browser',
        ],
        answer: 1,
        explanation:
          'Deterministic synchronization (condition waits), controlling external dependencies via stubs, and stable data reduce async flakiness far better than blanket sleeps.',
      },
      {
        id: 'au-c-3',
        type: 'scenario',
        question:
          'Your full regression takes 3 hours in CI, blocking PRs. Which combination best reduces feedback time WITHOUT sacrificing critical coverage?',
        options: [
          'Delete half the tests at random',
          'Parallelize/shard tests, run a fast smoke subset on every PR, gate full regression nightly, and apply risk-based/impacted-test selection',
          'Run everything sequentially but on weekends only',
          'Only test in production',
        ],
        answer: 1,
        explanation:
          'Sharding + a fast PR smoke suite + nightly full regression + impacted-test selection gives quick PR feedback while preserving deep coverage on a sensible cadence.',
      },
      {
        id: 'au-c-4',
        type: 'mcq',
        question:
          'What is the purpose of a "quarantine" mechanism for flaky tests in a mature CI pipeline?',
        options: [
          'To permanently delete flaky tests',
          'To isolate known-flaky tests so they do not block the pipeline, while tracking them for root-cause fixing',
          'To run flaky tests 100 times',
          'To hide test results from the team',
        ],
        answer: 1,
        explanation:
          'Quarantining separates known-flaky tests from the blocking gate, keeping delivery unblocked while the team fixes root causes and monitors flakiness trends.',
      },
      {
        id: 'au-c-5',
        type: 'mcq',
        question:
          'When testing a distributed system, why might you introduce contract tests instead of only full end-to-end tests?',
        options: [
          'Contract tests are slower and more brittle',
          'Contract tests verify service interface agreements quickly and in isolation, catching integration breakages without expensive, flaky full E2E runs',
          'They replace the need for any automation',
          'They only test the UI layer',
        ],
        answer: 1,
        explanation:
          'Contract tests validate provider/consumer interface expectations fast and independently, catching breaking changes earlier and more reliably than heavy end-to-end suites.',
      },
    ],
  },

  'general-swe': {
    beginner: [
      {
        id: 'sw-b-1',
        type: 'mcq',
        question: 'What is the time complexity of accessing an element by index in an array?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        answer: 0,
        explanation:
          'Arrays provide constant-time O(1) random access because the memory address is computed directly from the base address and index.',
      },
      {
        id: 'sw-b-2',
        type: 'mcq',
        question: 'Which data structure operates on a Last-In-First-Out (LIFO) principle?',
        options: ['Queue', 'Stack', 'Linked List', 'Hash Map'],
        answer: 1,
        explanation:
          'A Stack is LIFO: the last element pushed is the first one popped. A Queue is FIFO.',
      },
      {
        id: 'sw-b-3',
        type: 'mcq',
        question: 'In OOP, what does "encapsulation" mean?',
        options: [
          'Copying code between classes',
          'Bundling data with the methods that operate on it and restricting direct external access to internal state',
          'Running code in parallel',
          'Deleting unused variables',
        ],
        answer: 1,
        explanation:
          'Encapsulation binds data and behavior together and hides internal state behind a controlled interface, protecting invariants.',
      },
      {
        id: 'sw-b-4',
        type: 'scenario',
        question:
          'You need to check whether a value exists in a collection thousands of times. Which structure gives the best average lookup performance?',
        options: [
          'An unsorted array (linear scan)',
          'A hash set / hash map with O(1) average lookup',
          'A linked list',
          'A stack',
        ],
        answer: 1,
        explanation:
          'A hash set provides average O(1) membership checks, vastly outperforming an O(n) linear scan for frequent lookups.',
      },
      {
        id: 'sw-b-5',
        type: 'mcq',
        question: 'What does the DRY principle stand for in software development?',
        options: [
          "Don't Repeat Yourself",
          'Do Run Yearly',
          'Data Reads Yield',
          'Debug, Run, Yield',
        ],
        answer: 0,
        explanation:
          'DRY ("Don\'t Repeat Yourself") encourages eliminating duplication by abstracting shared logic into a single authoritative place.',
      },
    ],
    intermediate: [
      {
        id: 'sw-i-1',
        type: 'mcq',
        question: 'What is the average and worst-case time complexity of QuickSort?',
        options: [
          'Average O(n log n), worst O(n²)',
          'Average O(n), worst O(n log n)',
          'Always O(n²)',
          'Always O(log n)',
        ],
        answer: 0,
        explanation:
          'QuickSort averages O(n log n) but degrades to O(n²) on poor pivot choices (e.g., already-sorted input with naive pivot selection).',
      },
      {
        id: 'sw-i-2',
        type: 'scenario',
        question:
          'Two threads increment a shared counter without synchronization and the final value is wrong. What is the root cause and best fix?',
        options: [
          'The CPU is broken; buy a new one',
          'A race condition on the shared counter; fix with synchronization (locks/atomic operations)',
          'Too little RAM; add more',
          'The variable name is too long',
        ],
        answer: 1,
        explanation:
          'Concurrent read-modify-write without synchronization is a classic race condition; atomic operations or locks make the increment thread-safe.',
      },
      {
        id: 'sw-i-3',
        type: 'mcq',
        question: 'Which HTTP method is idempotent and typically used to fully update/replace a resource?',
        options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
        answer: 1,
        explanation:
          'PUT is idempotent — repeating the same PUT yields the same result — and conventionally replaces the target resource. POST is not idempotent.',
      },
      {
        id: 'sw-i-4',
        type: 'mcq',
        question:
          'In database design, what does the "N+1 query problem" refer to?',
        options: [
          'Running one query to fetch N records, then one additional query per record — causing excessive round trips',
          'A query that returns N+1 columns',
          'Adding an index to N tables',
          'A query that always fails',
        ],
        answer: 0,
        explanation:
          'The N+1 problem executes 1 query for a list then N follow-up queries (one per item). It is fixed with eager loading / joins / batching.',
      },
      {
        id: 'sw-i-5',
        type: 'scenario',
        question:
          'A REST endpoint occasionally returns stale data because results are cached. Users need fresh data after updates. What is a sound approach?',
        options: [
          'Never cache anything, ever',
          'Invalidate/refresh the cache on write, or use appropriate TTLs and cache-control based on data volatility',
          'Restart the server after every request',
          'Tell users to refresh 10 times',
        ],
        answer: 1,
        explanation:
          'Cache invalidation on writes (or volatility-appropriate TTLs) keeps data fresh while retaining the performance benefits of caching.',
      },
    ],
    complex: [
      {
        id: 'sw-c-1',
        type: 'scenario',
        question:
          'You must design a URL shortener handling 10,000 writes/sec and billions of reads. Which architecture is STRONGEST?',
        options: [
          'A single SQL server with no caching',
          'Distributed key generation (e.g., base62 of a unique/sharded id), horizontal read scaling with caching (CDN/Redis), and a replicated/partitioned datastore',
          'Store every URL in a local text file',
          'Generate random keys and retry on every collision with a full table scan',
        ],
        answer: 1,
        explanation:
          'High-scale shorteners need collision-free distributed key generation, aggressive caching for read-heavy traffic, and a partitioned/replicated store for durability and throughput.',
      },
      {
        id: 'sw-c-2',
        type: 'mcq',
        question:
          'According to the CAP theorem, during a network partition a distributed system must choose between:',
        options: [
          'Consistency and Availability',
          'Cost and Performance',
          'Latency and Bandwidth',
          'Security and Usability',
        ],
        answer: 0,
        explanation:
          'CAP states that under a partition (P), a system must trade off between Consistency (C) and Availability (A) — you cannot fully guarantee both simultaneously.',
      },
      {
        id: 'sw-c-3',
        type: 'scenario',
        question:
          'A service must remain responsive even when a downstream dependency becomes slow or fails. Which resilience patterns apply BEST?',
        options: [
          'Retry forever with no limits',
          'Circuit breaker + timeouts + bulkheads + graceful fallback (and bounded retries with backoff)',
          'Crash the whole system on any error',
          'Ignore all failures silently',
        ],
        answer: 1,
        explanation:
          'Circuit breakers stop hammering a failing dependency, timeouts bound waits, bulkheads isolate resources, and fallbacks degrade gracefully — together preserving responsiveness.',
      },
      {
        id: 'sw-c-4',
        type: 'mcq',
        question:
          'Which approach best guarantees data consistency across multiple microservices in a single business transaction without distributed 2PC?',
        options: [
          'Sharing one database table across all services',
          'The Saga pattern with compensating transactions (choreography or orchestration)',
          'Ignoring failures',
          'Locking every service until done',
        ],
        answer: 1,
        explanation:
          'The Saga pattern breaks a distributed transaction into local steps with compensating actions to undo on failure, avoiding the availability cost of two-phase commit.',
      },
      {
        id: 'sw-c-5',
        type: 'scenario',
        question:
          'Given an array of n integers, you must find if any two sum to a target, optimally. Which is the BEST approach?',
        code: "// Example\ninput = [2, 7, 11, 15], target = 9\n// expected: true  (2 + 7)",
        options: [
          'Nested loops checking every pair — O(n²) time',
          'Single pass with a hash set storing seen values, checking target - current — O(n) time, O(n) space',
          'Sort then print the array',
          'Random guessing until found',
        ],
        answer: 1,
        explanation:
          'A hash set lets you check for the complement (target - current) in O(1) as you iterate once, giving an overall O(n) time solution versus the naive O(n²).',
      },
    ],
  },
}

// Helper: returns the question list for a domain/level (empty array if missing).
export const getQuestions = (domainId, levelId) => {
  return QUESTIONS?.[domainId]?.[levelId] ?? []
}
