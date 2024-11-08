// fragments microservice API to use, defaults to localhost:8080 if not set in env
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function getFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    let fragments = await res.json();
    fragments = fragments.fragments[0]

    // Fetch the data for each fragment and append it to the metadata
    const fragmentDataPromises = fragments.map(async (fragment) => {
      const fragmentId = fragment.id;

      try {
        const fragmentRes = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
          headers: user.authorizationHeaders(),
        });

        if (!fragmentRes.ok) {
          throw new Error(`${fragmentRes.status} ${fragmentRes.statusText}`);
        }

        const contentType = fragmentRes.headers.get("Content-Type");
        let fragmentData;
        if (contentType && contentType.includes("application/json")) {
          fragmentData = await fragmentRes.json();
        } else {
          fragmentData = await fragmentRes.text();
        }


        return { ...fragment, data: fragmentData };
      } catch (fragmentErr) {
        console.error(`Unable to call GET /v1/fragments/${fragmentId}`, { fragmentErr });
        return fragment; // Return fragment metadata if data fetch fails
      }
    });

    // Resolve all fragment data promises
    const fragmentsWithData = await Promise.all(fragmentDataPromises);

    return fragmentsWithData;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}
